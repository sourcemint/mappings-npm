
const PATH = require("path");


exports.for = function(packagePath) {
    return new Mappings(packagePath);
}


var Mappings = function(packagePath) {
    this.packagePath = packagePath;
}

Mappings.prototype.resolve = function(uri, silent) {
    try {
        var uriParts = uri.split("/");
        var path = walkPackagesForName(this.packagePath, uriParts.shift());

        // TODO: Load descriptor to resolve `directories.lib`.

        var modulePath = PATH.join(path, uriParts.join("/"));

        return modulePath;

    } catch(err) {
        if (silent === true) {
            return false;
        }
        err.message = "for package[" + this.packagePath + "]: " + err.message;
        throw err;
    }
}


function walkPackagesForName(packagePath, name) {
    var path = PATH.join(packagePath, "mapped_packages", name);
    if (PATH.existsSync(path)) {
        return path;
    }
    path = PATH.join(packagePath, "node_modules", name);
    if (PATH.existsSync(path)) {
        return path;
    }
    var nextPath = PATH.join(packagePath, "..");
    if (nextPath === packagePath) {
        throw new Error("No mapped package found for alias '" + name + "'");
    }
    return walkPackagesForName(nextPath, name);
}
