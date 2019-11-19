import { LanguageClient } from "vscode-languageclient";
import { Analyzer } from "../../shared/analyzer";
import { EventEmitter } from "../../shared/events";
import { AnalyzerStatusNotification, DiagnosticServerRequest } from "../lsp/custom_protocol";

export class LspAnalyzer extends Analyzer {
	public readonly onReady: Promise<void>;
	public readonly onInitialAnalysisComplete: Promise<void>;
	public readonly onAnalysisStatusChange = new EventEmitter<{ isAnalyzing: boolean }>();

	constructor(private readonly client: LanguageClient) {
		super();

		// TODO: Move setup stuff in here.

		this.onReady = client.onReady();

		this.onInitialAnalysisComplete = new Promise((resolve) => {
			this.onReady.then(() => {
				this.client.onNotification(AnalyzerStatusNotification.type, (params) => {
					resolve();
					this.onAnalysisStatusChange.fire({ isAnalyzing: params.isAnalyzing });
				});
			});
		});
	}

	public async getDiagnosticServerPort(): Promise<{ port: number }> {
		return this.client.sendRequest(DiagnosticServerRequest.type, undefined);
	}

	public dispose(): void | Promise<void> {
		this.onAnalysisStatusChange.dispose();
	}
}
