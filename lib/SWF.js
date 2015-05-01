//{@swf
(function(global) {
"use strict";

// --- dependency modules ----------------------------------
var ZLib = global["Codec"]["ZLib"];

// --- define / local variables ----------------------------
//var _isNodeOrNodeWebKit = !!global.global;
//var _runOnNodeWebKit =  _isNodeOrNodeWebKit && /native/.test(setTimeout);
//var _runOnNode       =  _isNodeOrNodeWebKit && !/native/.test(setTimeout);
//var _runOnWorker     = !_isNodeOrNodeWebKit && "WorkerLocation" in global;
//var _runOnBrowser    = !_isNodeOrNodeWebKit && "document" in global;

var TAG_TYPE_END                    =  0; // SWF1+
var TAG_TYPE_SHOW_FRAME             =  1; // SWF1+
var TAG_TYPE_DEFINE_SHAPE           =  2; // SWF1+
var TAG_TYPE_PLACE_OBJECT           =  4; // SWF1+
var TAG_TYPE_REMOVE_OBJECT          =  5; // SWF1+
var TAG_TYPE_DEFINE_BITS            =  6; // SWF1+
var TAG_TYPE_DEFINE_BUTTON          =  7; // SWF1+
var TAG_TYPE_JPEG_TABLES            =  8; // SWF1+
var TAG_TYPE_SET_BACKGROUND_COLOR   =  9; // SWF1+
var TAG_TYPE_DEFINE_FONT            = 10; // SWF1+
var TAG_TYPE_DEFINE_TEXT            = 11; // SWF1+
var TAG_TYPE_DO_ACTION              = 12; // SWF3+ and (AS1 or AS2)
var TAG_TYPE_DEFINE_FONT_INFO       = 13; // SWF1+
var TAG_TYPE_DEFINE_SOUND           = 14; // SWF1+
var TAG_TYPE_START_SOUND            = 15; // SWF1+
var TAG_TYPE_DEFINE_BUTTON_SOUND    = 17; // SWF2+
var TAG_TYPE_SOUND_STREAM_HEAD      = 18; // SWF1+
var TAG_TYPE_SOUND_STREAM_BLOCK     = 19; // SWF1+
var TAG_TYPE_DEFINE_BITS_LOSSLESS   = 20; // SWF2+
var TAG_TYPE_DEFINE_BITS_JPEG2      = 21; // SWF2+ (SWF8+ PNG or GIF89a)
var TAG_TYPE_DEFINE_SHAPE2          = 22; // SWF2+
var TAG_TYPE_DEFINE_BUTTON_CXFORM   = 23; // SWF2+
var TAG_TYPE_PROTECT                = 24; // SWF2+
var TAG_TYPE_PLACE_OBJECT2          = 26; // SWF3+
var TAG_TYPE_REMOVE_OBJECT2         = 28; // SWF3+
var TAG_TYPE_DEFINE_SHAPE3          = 32; // SWF3+
var TAG_TYPE_DEFINE_TEXT2           = 33; // SWF3+
var TAG_TYPE_DEFINE_BUTTON2         = 34; // SWF3+
var TAG_TYPE_DEFINE_BITS_JPEG3      = 35; // SWF3+ (SWF8+ PNG or GIF89a)
var TAG_TYPE_DEFINE_BITS_LOSSLESS2  = 36; // SWF3+
var TAG_TYPE_DEFINE_EDIT_TEXT       = 37; // SWF4+
var TAG_TYPE_DEFINE_SPRITE          = 39; // SWF3+
var TAG_TYPE_FRAME_LABEL            = 43; // SWF3+
var TAG_TYPE_SOUND_STREAM_HEAD2     = 45; // SWF3+
var TAG_TYPE_DEFINE_MORPH_SHAPE     = 46; // SWF3+
var TAG_TYPE_DEFINE_FONT2           = 48; // SWF3+
var TAG_TYPE_EXPORT_ASSETS          = 56; // SWF5+
var TAG_TYPE_IMPORT_ASSETS          = 57; // SWF5-7 (deprecated in SWF8+)
var TAG_TYPE_ENABLE_DEBUGGER        = 58; // SWF5+
var TAG_TYPE_DO_INIT_ACTION         = 59; // SWF6+ and (AS1 or AS2)
var TAG_TYPE_DEFINE_VIDEO_STREAM    = 60; // SWF6+
var TAG_TYPE_VIDEO_FRAME            = 61; // SWF6+
var TAG_TYPE_DEFINE_FONT_INFO2      = 62; // SWF6+
var TAG_TYPE_ENABLE_DEBUGGER2       = 64; // SWF6+
var TAG_TYPE_SCRIPT_LIMITS          = 65; // SWF7+
var TAG_TYPE_SET_TAB_INDEX          = 66; // SWF7+
var TAG_TYPE_FILE_ATTRIBUTES        = 69; // SWF8+
var TAG_TYPE_PLACE_OBJECT3          = 70; // SWF8+
var TAG_TYPE_IMPORT_ASSETS2         = 71; // SWF8+
var TAG_TYPE_DEFINE_FONT_ALIGN_ZONES= 73; // SWF8+
var TAG_TYPE_CSMTEXT_SETTINGS       = 74; // SWF8+
var TAG_TYPE_DEFINE_FONT3           = 75; // SWF8+
var TAG_TYPE_SYMBOL_CLASS           = 76; // SWF9+
var TAG_TYPE_METADATA               = 77; // SWF1+
var TAG_TYPE_DEFINE_SCALING_GRID    = 78; // SWF8+
var TAG_TYPE_DO_ABC                 = 82; // SWF9+ and AS3
var TAG_TYPE_DEFINE_SHAPE4          = 83; // SWF8+
var TAG_TYPE_DEFINE_MORPH_SHAPE2    = 84; // SWF8+
var TAG_TYPE_DEFINE_SCENE_AND_FRAME_LABEL_DATA = 86; // SWF?
var TAG_TYPE_DEFINE_BINARY_DATA     = 87; // SWF9+
var TAG_TYPE_DEFINE_FONT_NAME       = 88; // SWF9+
var TAG_TYPE_START_SOUND2           = 89; // SWF9+
var TAG_TYPE_DEFINE_BITS_JPEG4      = 90; // SWF10+
var TAG_TYPE_DEFINE_FONT4           = 91; // SWF10+
var TAG_TYPE_ENABLE_TELEMETRY       = 93; // SWF10+

// --- class / interfaces ----------------------------------
var SWF = {
    "load":         SWF_load,     // SWF.load(source:URLString, callback:Function, errorback:Function):void
    "parse":        SWF_parse,    // SWF.parse(source:Uint8Array, cursor:UINT32 = 0, options:Object = {}):SWFDataObject
    "decode":       SWF_decode,   // SWF.decode(source:Uint8Array, data:SWFDataObject):SWFDataObject|null
    "VERIFY":       false,
    "VERBOSE":      false,
//{@dev
    "repository":   "https://github.com/uupaa/SWF.js" // GitHub repository URL. http://git.io/Help
//}@dev
};

// --- implements ------------------------------------------
function SWF_load(source,      // @arg URLString
                  callback,    // @arg Function - callback(result:Uint8Array):void
                  errorback) { // @arg Function - errorback(error:Error):void
    // TODO: test
    var xhr = new XMLHttpRequest();

    xhr.open("GET", source);
    xhr.responseType = "arraybuffer";
    xhr.onerror = errorback;
    xhr.onload = function() {
        if (xhr.status >= 200 && xhr.status < 300) {
            callback(xhr.response);
        } else {
            errorback(new Error(xhr.status);
        }
        xhr.onload = null;
        xhr = null;
    };
    xhr.send();
}

function SWF_parse(source,    // @arg Uint8Array - SWF source data.
                   options) { // @arg Object = {}
                              // @ret SWFDataObject|null
//{@dev
    if (!global["BENCHMARK"]) {
        $valid($type(source, "Uint8Array"),        SWF_parse, "source");
        $valid($type(options, "Object|omit"),      SWF_parse, "options");
        if (options) {
        }
    }
//}@dev

    if (!source) {
        return null;
    }

    options = options || {};

    var data = {
            // --- Header ---
            "Vesion":       0x0,            // UINT8 - SWF file version
            "FileLength":   0x00000000,     // UINT32 - SWF file length
            "FrameSize":    null,           // RECT
            "FrameRate":    0,              // UINT16
            "FrameCount":   0,              // UINT16
            "compression":  0,              // compression mode. 1 = uncompressed, 2 = zlib, 3 = LZMA(unsupported)
            //"frames":       [],             // FrameObject. [PosterFrame, AnimationFrame1, AnimationFrame2, ...]
            //"blobs":        [],             // [Blob, ...]
        };
    var view = {
            source:         source,         // Uint8Array - source data.
            cursor:         0,              // UINT32 - source cursor.
            tagList:        [],             // TagCodeArray. [... 0]
        };

    // --- detect SWF signature and compression mode ---
    var compressionMode = 0;

    switch ( _readString(view, 3) ) { // signature
    case "FWS": compressionMode = "";     // uncompressed (SWF1++)
    case "CWS": compressionMode = "ZLIB"; // zlib compressed (SWF6++)
    case "ZWS": compressionMode = "LZMA"; // LZMA compressed (SWF13++)
    default: return null; // ERROR
    }

    var swfVersion = view.source[view.cursor++]; // SWF file format version.
    var fileLength = _read4(view); // SWF file length.

    // --- check file length ---
    if (SWF["VERBOSE"] && fileLength !== view.source.length) {
        console.warn("FileLength(" + fileLength + ") !== source.length(" + view.source.length + ")");
        // return null;
    }

    // --- decompress ---
    switch (compressionMode) {
    case "ZLIB":
        view.source = ZLib["inflate"](view.source.subarray(8, fileLength - 8), { "bufferSize": 0x20000 }); // 128kb
        view.cursor = 0;
        break;
    case "LZMA":
        console.error("LZMA compression unsupported");
        return null;
    }

    data["Version"] = swfVersion;
    data["FileLength"] = fileLength;

    data["FrameSize"] = _readRECT(view);
    data["FrameRate"] = _read2(view);
    data["FrameCount"] = _read2(view);

    var sourceLength = view.source.length;

    while (view.cursor < sourceLength) {
        var tagCodeAndLength = _read2(view);
        var tagLength = tagCodeAndLength & 0x3F;
        var tagType   = tagCodeAndLength >> 10; // tagType as tagCode

        if (tagLength === 0x3F) {
            tagLength = _read4(view);
        }
        switch (tagType) {
        case TAG_TYPE_END:
        case TAG_TYPE_SHOW_FRAME:
        }
    }

    return data;
}

function SWF_decode(source, // @arg Uint8Array - PNG or APNG source data
                    data) { // @arg SWFDataObject|null
                            // @ret SWFDataObject|null - { ... }
//{@dev
    if (!global["BENCHMARK"]) {
        $valid($type(source, "Uint8Array"),         SWF_decode, "source");
        $valid($type(data,   "SWFDataObject|null"), SWF_decode, "data");
    }
//}@dev

    // TODO: impl

    return data;
}

function _readString(view, size) { // @ret String
    view.cursor += size;
    var u8 = view.source.subarray(view.cursor - size, view.cursor);

    return String.fromCharCode.apply(null, u8);
}

function _read4(view) { // @ret UINT32
    return ((view.source[view.cursor++]  << 24) |
            (view.source[view.cursor++]  << 16) |
            (view.source[view.cursor++]  <<  8) |
             view.source[view.cursor++]) >>> 0;
}
function _read2(view) { // @ret UINT16
    return ((view.source[view.cursor++]  <<  8) |
             view.source[view.cursor++]) >>> 0;
}
function _readRECT(view) {
    // TODO: impl
}

// --- validate / assertions -------------------------------
//{@dev
function $valid(val, fn, hint) { if (global["Valid"]) { global["Valid"](val, fn, hint); } }
function $type(obj, type) { return global["Valid"] ? global["Valid"].type(obj, type) : true; }
//function $keys(obj, str) { return global["Valid"] ? global["Valid"].keys(obj, str) : true; }
//function $some(val, str, ignore) { return global["Valid"] ? global["Valid"].some(val, str, ignore) : true; }
//function $args(fn, args) { if (global["Valid"]) { global["Valid"].args(fn, args); } }
//}@dev

// --- exports ---------------------------------------------
if (typeof module !== "undefined") {
    module["exports"] = SWFParser;
}
global["SWFParser" in global ? "SWFParser_" : "SWFParser"] = SWFParser; // switch module. http://git.io/Minify

})((this || 0).self || global); // WebModule idiom. http://git.io/WebModule
//}@swf

