const fs = require("fs");
const sqlite3 = require('sqlite3').verbose();

const db_path = process.argv[2];
const sound_path = process.argv[3];

var db = new sqlite3.Database(db_path);
var remaining_BGMs = [];

db.each("select * from datas,texts where datas.id=texts.id", (err, result) => {
	if (err) {
		console.error(err);
	} else { 
		for (var i = 1; i <= 16; ++i) { 
			const bgm_name = result["str" + i];
			if (bgm_name.length > 0 && remaining_BGMs.indexOf(bgm_name) == -1) {
				remaining_BGMs.push(bgm_name);
				//console.log(bgm_name);
			}
		}
	}
}, () => { 
		console.log("REMAINING:", remaining_BGMs.length);
		const file_list = fs.readdirSync(sound_path);
		console.log("CURRENT:", file_list.length);
		var deprecated_list = [];
		for (var name of file_list) {
			if (remaining_BGMs.indexOf(name.slice(0, name.length - 4)) == -1) {
				//console.log(name);
				deprecated_list.push(name);
				const full_path = sound_path + "/" + name;
				fs.unlinkSync(full_path);
				console.log("REMOVED:", full_path);
			}
		}
		console.log("DEPRECATED:", deprecated_list.length);
});
