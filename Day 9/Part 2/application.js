require("fs").readFile("./input/input.txt", 'utf8', function (err, compressedData) {
    if (err) {
        return console.log(err);
    }

    let decompressedInfo = decompressData(compressedData);
    console.log(decompressedInfo);
});

function decompressData(compressedData) {
    let results = analyzeData(compressedData);
    let decompressedData = 0;

    while(results != null) {
        decompressedData += results[1].length;

        let copyPart = results[5].substr(0, parseInt(results[3]));
        let decompressedMarker = [...Array(parseInt(results[4]))].map(() => copyPart).join("");

        compressedData = decompressedMarker + results[5].substr(results[3]);
        results = analyzeData(compressedData);
    }

    return decompressedData + compressedData.length;
}

function analyzeData(data) {
    return data.match(/^(.*?)(\((\d+)x(\d+)\))(.*)$/);
}