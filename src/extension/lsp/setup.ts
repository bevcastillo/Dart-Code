import * as path from "path";
import * as stream from "stream";
import * as vs from "vscode";
import { LanguageClient, LanguageClientOptions, StreamInfo } from "vscode-languageclient";
import { dartVMPath } from "../../shared/constants";
import { DartSdks, Logger } from "../../shared/interfaces";
import { getAnalyzerArgs } from "../analysis/analyzer";
import { config } from "../config";
import { DartCapabilities } from "../sdk/capabilities";
import { safeSpawn } from "../utils/processes";

export let lspClient: LanguageClient;

export function initLSP(logger: Logger, sdks: DartSdks, dartCapabilities: DartCapabilities): vs.Disposable {
	vs.window.showInformationMessage("LSP preview is enabled!");
	return startLsp(logger, sdks, dartCapabilities);
}

function startLsp(logger: Logger, sdks: DartSdks, dartCapabilities: DartCapabilities): vs.Disposable {
	const clientOptions: LanguageClientOptions = {
		initializationOptions: {
			// 	onlyAnalyzeProjectsWithOpenFiles: true,
			closingLabels: config.closingLabels,
		},
		outputChannelName: "LSP",
	};

	lspClient = new LanguageClient(
		"dartAnalysisLSP",
		"Dart Analysis Server",
		() => spawn(logger, sdks, dartCapabilities),
		clientOptions,
	);

	return lspClient.start();
}

function spawn(logger: Logger, sdks: DartSdks, dartCapabilities: DartCapabilities): Thenable<StreamInfo> {
	// TODO: Replace with constructing an Analyzer that passes LSP flag (but still reads config
	// from paths etc) and provide it's process.
	const vmPath = path.join(sdks.dart, dartVMPath);
	const args = getAnalyzerArgs(logger, sdks, dartCapabilities, true);

	const process = safeSpawn(undefined, vmPath, args);
	// TODO: Set up logging for LSP.
	// logProcess(logger, LogCategory.Analyzer, process);

	if (true) {
		return Promise.resolve({ reader: process.stdout, writer: process.stdin });
	} else {
		// TODO: Run this through logger once the in-process logging changes
		const reader = process.stdout.pipe(new LoggingTransform("<=="));
		const writer = new LoggingTransform("==>");
		writer.pipe(process.stdin);

		return Promise.resolve({ reader, writer });
	}
}

class LoggingTransform extends stream.Transform {
	constructor(private prefix: string, opts?: stream.TransformOptions) {
		super(opts);
	}
	public _transform(chunk: any, encoding: string, callback: () => void): void {
		console.log(`${this.prefix} ${chunk}`);
		this.push(chunk, encoding);
		callback();
	}
}
