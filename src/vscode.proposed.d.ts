/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

/**
 * This is the place for API experiments and proposals.
 * These API are NOT stable and subject to change. They are only available in the Insiders
 * distribution and CANNOT be used in published extensions.
 *
 * To test these API in local environment:
 * - Use Insiders release of VS Code.
 * - Add `"enableProposedApi": true` to your package.json.
 * - Copy this file to your project.
 */

declare module 'vscode' {

	// #region asExternalUri — mjbvz

	namespace env {
		/**
		 * Resolves an *external* uri, such as a `http:` or `https:` link, from where the extension is running to a
		 * uri to the same resource on the client machine.
		 *
		 * This is a no-op if the extension is running on the client machine. Currently only supports
		 * `https:` and `http:` uris.
		 *
		 * If the extension is running remotely, this function automatically establishes a port forwarding tunnel
		 * from the local machine to `target` on the remote and returns a local uri to the tunnel. The lifetime of
		 * the port fowarding tunnel is managed by VS Code and the tunnel can be closed by the user.
		 *
		 * Extensions should not cache the result of `asExternalUri` as the resolved uri may become invalid due to
		 * a system or user action — for example, in remote cases, a user may close a port forwardng tunnel
		 * that was opened by `asExternalUri`.
		 *
		 * Note: uris passed through `openExternal` are automatically resolved and you should not call `asExternalUri`
		 * on them.
		 *
		 * @return A uri that can be used on the client machine.
		 */
		export function asExternalUri(target: Uri): Thenable<Uri>;
	}

	//#endregion
}
