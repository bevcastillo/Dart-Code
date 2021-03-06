import * as http from "http";
import * as https from "https";
import * as url from "url";

// To avoid depending on VS Code files here, this is overwritten in extension.ts.
let userAgent = "Dart-Code https://dartcode.org/";

export function setUserAgent(extensionVersion: string) {
	userAgent = `Dart-Code/${extensionVersion} (https://dartcode.org/)`;
}

// TODO: Move over things over to this...
export function fetch(urlString: string, headers?: http.OutgoingHttpHeaders) {
	const u = url.parse(urlString);
	if (u.protocol === "https:")
		return fetchHttps(u.hostname, u.port, u.path, headers);
	else if (u.protocol === "http:")
		return fetchHttp(u.hostname, u.port, u.path, headers);
	else
		throw new Error(`Cannot fetch URL ${urlString}`);
}

function fetchHttps(hostname: string | undefined, port: string | undefined, path: string | undefined, headers: http.OutgoingHttpHeaders = {}): Promise<string> {
	return new Promise<string>((resolve, reject) => {
		const options: https.RequestOptions = {
			headers: {
				...headers,
				"User-Agent": userAgent,
			},
			hostname,
			method: "GET",
			path,
			port,
		};

		const req = https.request(options, (resp) => {
			if (!resp || !resp.statusCode || resp.statusCode < 200 || resp.statusCode > 300) {
				reject({ message: `Failed to get ${path}: ${resp && resp.statusCode}: ${resp && resp.statusMessage}` });
			} else {
				const chunks: string[] = [];
				resp.on("data", (b) => chunks.push(b.toString()));
				resp.on("end", () => {
					const data = chunks.join("");
					resolve(data);
				});
			}
		});
		req.end();
	});
}

function fetchHttp(hostname: string | undefined, port: string | undefined, path: string | undefined, headers: http.OutgoingHttpHeaders = {}): Promise<string> {
	return new Promise<string>((resolve, reject) => {
		const options: http.RequestOptions = {
			headers: {
				...headers,
				"User-Agent": userAgent,
			},
			hostname,
			method: "GET",
			path,
			port,
		};

		const req = http.request(options, (resp) => {
			if (!resp || !resp.statusCode || resp.statusCode < 200 || resp.statusCode > 300) {
				reject({ message: `Failed to get ${path}: ${resp && resp.statusCode}: ${resp && resp.statusMessage}` });
			} else {
				const chunks: string[] = [];
				resp.on("data", (b) => chunks.push(b.toString()));
				resp.on("end", () => {
					const data = chunks.join("");
					resolve(data);
				});
			}
		});
		req.end();
	});
}
