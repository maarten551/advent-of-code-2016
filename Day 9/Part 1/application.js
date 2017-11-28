require("fs").readFile("./input/input.txt", 'utf8', function (err, compressedData) {
    if (err) {
        return console.log(err);
    }

    let decompressedInfo = decompressData(compressedData);
    console.log(decompressedInfo.length);
    console.log(decompressedInfo);
});

function decompressData(compressedData) {
    let results = compressedData.match(/^(.*?)(\((\d+)x(\d+)\))(.*)$/);

    if (results == null)
        return compressedData;

    let copyPart = results[5].substr(0, parseInt(results[3]));
    let decompressedMarker = [...Array(parseInt(results[4]))].map(() => copyPart).join("");

    return results[1] + decompressedMarker + decompressData(results[5].substr(results[3]));
}