(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push(["chunks/ssr/[root-of-the-server]__04nbcoq._.js",
"[externals]/node:buffer [external] (node:buffer, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:buffer", () => require("node:buffer"));

module.exports = mod;
}),
"[project]/app/actions/leads.ts [app-edge-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/* __next_internal_action_entry_do_not_use__ [{"40a6c9a86ff27caafa0dd65528e97fd2519d478c05":{"name":"submitLead"}},"app/actions/leads.ts",""] */ __turbopack_context__.s([
    "submitLead",
    ()=>submitLead
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$edge$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/next/dist/esm/build/webpack/loaders/next-flight-loader/server-reference.js [app-edge-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$server$2d$dom$2d$turbopack$2f$server$2e$edge$2e$js__$5b$app$2d$edge$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react-server-dom-turbopack/server.edge.js [app-edge-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$index$2e$mjs__$5b$app$2d$edge$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@supabase/supabase-js/dist/index.mjs [app-edge-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$edge$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/esm/build/webpack/loaders/next-flight-loader/action-validate.js [app-edge-rsc] (ecmascript)");
;
;
// We map both VITE_ and NEXT_PUBLIC_ for compatibility during the migration phase
const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
// Server-side Supabase client initialization
const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$index$2e$mjs__$5b$app$2d$edge$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createClient"])(supabaseUrl, supabaseKey);
async function submitLead(formData) {
    // 1. Check the Honeypot Field (Bot Mitigation)
    const honeypot = formData.get('fax_number');
    if (honeypot) {
        // Silently drop the bot submission to prevent them from trying again
        console.warn('[SECURITY] Bot detected and dropped via honeypot field.');
        return {
            success: true,
            message: "Request received."
        } // Fake success message
        ;
    }
    // 2. Extract Data
    const email = formData.get('email');
    const full_name = formData.get('full_name');
    const service_interest = formData.get('service_interest');
    const source = formData.get('source') || 'website_form';
    const message = formData.get('message');
    // Validate required fields
    if (!email || !service_interest) {
        return {
            success: false,
            error: "Missing required fields."
        };
    }
    // 3. Insert into Supabase
    try {
        const { error } = await supabase.from('leads').insert([
            {
                email,
                full_name,
                service_interest,
                source,
                message
            }
        ]);
        if (error) {
            console.error("[SUPABASE ERROR]:", error.message);
            return {
                success: false,
                error: "Database transmission failed. Please try again."
            };
        }
        return {
            success: true,
            message: "Transmission complete."
        };
    } catch (err) {
        console.error("[ACTION ERROR]:", err.message);
        return {
            success: false,
            error: "Internal server error."
        };
    }
}
;
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$edge$2d$rsc$5d$__$28$ecmascript$29$__["ensureServerEntryExports"])([
    submitLead
]);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$server$2d$dom$2d$turbopack$2f$server$2e$edge$2e$js__$5b$app$2d$edge$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(submitLead, "40a6c9a86ff27caafa0dd65528e97fd2519d478c05", null);
}),
"[project]/.next-internal/server/app/page/actions.js { ACTIONS_MODULE0 => \"[project]/app/actions/leads.ts [app-edge-rsc] (ecmascript)\" } [app-edge-rsc] (server actions loader, ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$actions$2f$leads$2e$ts__$5b$app$2d$edge$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/actions/leads.ts [app-edge-rsc] (ecmascript)");
;
}),
"[project]/.next-internal/server/app/page/actions.js { ACTIONS_MODULE0 => \"[project]/app/actions/leads.ts [app-edge-rsc] (ecmascript)\" } [app-edge-rsc] (server actions loader, ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "40a6c9a86ff27caafa0dd65528e97fd2519d478c05",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$actions$2f$leads$2e$ts__$5b$app$2d$edge$2d$rsc$5d$__$28$ecmascript$29$__["submitLead"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$app$2f$actions$2f$leads$2e$ts__$5b$app$2d$edge$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$edge$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i('[project]/.next-internal/server/app/page/actions.js { ACTIONS_MODULE0 => "[project]/app/actions/leads.ts [app-edge-rsc] (ecmascript)" } [app-edge-rsc] (server actions loader, ecmascript) <locals>');
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$actions$2f$leads$2e$ts__$5b$app$2d$edge$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/actions/leads.ts [app-edge-rsc] (ecmascript)");
}),
]);

//# sourceMappingURL=%5Broot-of-the-server%5D__04nbcoq._.js.map