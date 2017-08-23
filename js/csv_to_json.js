	const readline = require('readline')
	const fs = require('fs')													
	const rl = readline.createInterface({
		input: fs.createReadStream('Indicators.csv')
	});

	let year_object=[];
	let urban_grow=[];
	let arr=[];
	let arr1=[];
	let total_sum=[];

		rl.on('line', (line) => {							// reading the data line by line.
			line.split('\n')								
			arr=line.split(',');
			let jsonFromLine1 = {};
			sum = [],
			jasonFile = {},
			obj={}
			let lineSplit = line.split(","); 
			jasonFile.countryCode = lineSplit[1];
			jasonFile.Rural = lineSplit[2];
			jasonFile.Urban = lineSplit[2];
			jasonFile.value;
			jasonFile.year = lineSplit[4]; 

		if(arr[1] == "IND" && (arr[arr.length - 3] == "SP.URB.TOTL.IN.ZS" || arr[arr.length - 3] == "SP.RUR.TOTL.ZS")) {  //condition for total percentage in India
			if(year_object.find(x => x.year === arr[arr.length - 2]) == undefined) {
				let temp = { year : arr[arr.length - 2] }
				temp[(arr[arr.length - 3] =="SP.URB.TOTL.IN.ZS")?"urban":"rural"] = parseFloat(arr[arr.length - 1]);  //considers urban, if it finds the value.
				year_object.push(temp);
			}
			else {
				let index = year_object.findIndex(x => x.year === arr[arr.length -2]);
				year_object[index][(arr[arr.length - 3] =="SP.URB.TOTL.IN.ZS")?"urban":"rural"]= parseFloat(arr[arr.length - 1]);	
			}
		}
				if(arr[1] === "IND" && arr[3] === "SP.URB.GROW") {			//condition for urban population growth annual percentage in India
					jsonFromLine1=parseFloat(arr[5]);
					urban_grow.push({"Year": parseFloat(arr[4]),"Urban_growth":jsonFromLine1});				//pushing the content into array
				}
				let asia = ['AFG', 'ARM', 'AZE', 'BGD', 'BTN', 'KHM', 'CHN', 'HKG', 'IND', 'IDN', 'JPN', 'KAZ', 'PRK', 'KOR', 'MAC', 'MYS', 'MDV', 'MUS', 'MNG', 'MMR', 'NPL', 'PAK', 'PHL', 'SGP', 'LKA', 'TZA', 'THA', 'TKM', 'UZB', 'VNM', 'YEM'];   //creating array for asian countries.
				for (i in asia) {
					if (jasonFile.countryCode === asia[i]) {						//condition for checking countries in asia
						if (jasonFile.Rural === 'Rural population' || jasonFile.Urban === 'Urban population') {
							jasonFile.value = lineSplit[5];               
							obj = {
								country: jasonFile.countryCode,
								year: jasonFile.year,
								value: jasonFile.value
							}
							arr1.push(obj)
						}        
					}
				}});
		rl.on('close', (line) => {				//writing the data line by line
			let json=JSON.stringify(year_object,null,2);
			let json1=JSON.stringify(urban_grow,null,2);
			fs.writeFile("./../json/total_percent.json",json);								//writing json file
			fs.writeFile("./../json/urb_percent.json",json1);
			let i = 0;
			for (let k = 0, j = 1; k <= arr1.length - 2; k = k + 2, j = j + 2) {
				obj = {
					country: arr1[k].country,
					year: arr1[k].year,
						sum: parseFloat(arr1[k].value) + parseFloat(arr1[j].value)				//converting strings to float and doing the sum
					}
					total_sum.push(obj);
					i = i + 1;
				}
				total_sum.sort((a,b)=>b.sum-a.sum);
				let json2 = JSON.stringify(total_sum,null,2);
				fs.writeFile('./../json/tot_pop_asia.json',json2);
			});


