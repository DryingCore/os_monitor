const os = require("os");
const blessed = require("blessed");
const pidusage = require("pidusage");

// Tela com o blessed
const screen = blessed.screen({
	smartCSR: true,
	title: "System Monitor",
});

// Caixa para informações
const box = blessed.box({
	top: "center",
	left: "center",
	width: "50%",
	height: "50%",
	content: "",
	tags: true,
	border: {
		type: "line",
	},
	style: {
		fg: "white",
		border: {
			fg: "#f0f0f0",
		},
	},
});

// adicionando a caixa a tela
screen.append(box);

// Atualizar informações
function updateSystemInfo() {
	pidusage(process.pid, (err, stats) => {
		if (err) {
			console.error(err);
			return;
		}

		const totalMemory = os.totalmem();
		const freeMemory = os.freemem();
		const cpuUsagePercentage = stats.cpu;

		// Atualizando o conteúdo da caixa com informações do sistema
		box.setContent(`CPU Usage: ${cpuUsagePercentage.toFixed(2)}%\n` + `Total Memory: ${formatBytes(totalMemory)}\n` + `Free Memory: ${formatBytes(freeMemory)}`);

		screen.render();
	});
}

// Formatando os bytes para string
function formatBytes(bytes) {
	const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
	const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
	return Math.round(100 * (bytes / Math.pow(1024, i))) / 100 + " " + sizes[i];
}

// Atualizando as informações a cada segundo
setInterval(updateSystemInfo, 1000);

// Capturando evento de redimensionamento da tela
screen.on("resize", () => {
	box.width = screen.width - 4;
	box.height = screen.height - 4;
	screen.render();
});

// Capturando evento de saída para encerrar a aplicação
screen.key(["escape", "q", "C-c"], (ch, key) => {
	process.exit(0);
});

// Inicializando a tela
screen.render();
