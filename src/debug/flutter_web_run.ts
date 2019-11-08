import { Logger } from "../shared/interfaces";
import { FlutterRunBase, RunMode } from "./flutter_run_base";

export class FlutterWebRun extends FlutterRunBase {
	constructor(mode: RunMode, pubBinPath: string, projectFolder: string | undefined, args: string[], envOverrides: any, logFile: string | undefined, logger: Logger, urlExposer: (url: string) => Promise<string>, maxLogLineLength: number) {
		super(mode, logFile, logger, urlExposer, maxLogLineLength, true, true);

		this.createProcess(projectFolder, pubBinPath, ["global", "run", "webdev", "daemon"].concat(args), envOverrides);
	}
}
