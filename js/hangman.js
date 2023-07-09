const chars = ['a', 'b', 'c', 'ç', 'd', 'e', 'f', 'g', 'ğ', 'h', 'ı', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'ö',
	'p', 'r', 's', 'ş', 't', 'u', 'ü', 'v', 'w', 'x', 'y', 'z']; // Kullanılan harfler

const items = {
	"Oyunlar" : ["Dying Light", "DOOM Eternal", "Half Life", "Counter Strike", "Undertale", "God Of War", "Elden Ring",
		"Dark Souls", "The Witcher", "Final Fantasy", "Portal", "Metal Hellsinger",
		"Grand Theft Auto", "Midnight Club", "Need For Speed", "Forza Horizon", "Dead Cells",
		"Vampire Survivors", "Call of Duty", "Battlefield"],
	
	"Filmler" : ["Home Alone", "Rush Hour", "Dangal", "Star Wars", "Toy Story", "Goodfellas", "Avengers",
		"The Dark Knight", "The Lord Of The Rings", "The Matrix", "Inception", "Interstellar", "Psycho",
		"The Lion King", "Madagascar", "Alien", "Avatar", "Joker", "Up", "Finding Nemo", "Inside Out"],
	
	"Şehirler" : ["Istanbul", "Ankara", "Eskişehir", "Konya", "Kırıkkale", "Balıkesir", "Adana",
		"Bursa", "Edirne", "Bolu", "Hatay", "Kütahya",
		"Giresun", "Ağrı", "Hakkari", "Bilecik", "Kilis", "Antalya", "Tekirdağ", "Çanakkale", "Muğla"]
	
}; // Oyunda kullanılan kategoriler ve ögeler

let category; // Seçilen kategori
let isStarted; // Oyunun başlayıp başlamadığı
let selectedItem; // Seçilen öge
let displayItem; // Seçilen ögenin ekrana yazılmış hali
let guess; // Tahmin edilen harf
let score = 0; // Puan
let lives = 7; // Can
let gameCount = 0; // Oyun sayısı
let winCount = 0; // Kazanılan oyun sayısı
let loseCount = 0; // Kaybedilen oyun sayısı

const displayCounts = (gameCount, winCount, loseCount) => {
	/* 
		param gameCount: Oyun sayısı
		param winCount: Kazanılan oyun sayısı
		param loseCount: Kaybedilen oyun sayısı

		Oyun sayılarını ekrana yazdırır.	
	*/
	const gameCountDiv = document.getElementById("game-count");
	const winCountDiv = document.getElementById("win-count");
	const loseCountDiv = document.getElementById("lose-count");

	gameCountDiv.innerHTML = gameCount;
	winCountDiv.innerHTML = winCount;
	loseCountDiv.innerHTML = loseCount;
}

const drawHanger = () => {
	/* 
		Asılacak çizgi adam için gerekli olan çerçeveyi çizer.
	*/
	const canvas = document.getElementById('hangman');
	const ctx = canvas.getContext('2d');
	ctx.strokeStyle = "white";
	ctx.beginPath();
	ctx.moveTo(25, 175);
	ctx.lineTo(125, 175);
	ctx.moveTo(75, 175);
	ctx.lineTo(75, 25);
	ctx.moveTo(75, 25);
	ctx.lineTo(175, 25);
	ctx.moveTo(175, 25);
	ctx.lineTo(175, 40);
	ctx.stroke();
}

const pickCategory = (pick) => {
	/* 
		param pick: Seçilen kategori

		Kategori seçimini yapar.
	*/
	category = pick;

	const resultDiv = document.getElementById("display-result");
	const gamesRadio = document.getElementById("select-game");
	const moviesRadio = document.getElementById("select-movie");
	const citiesRadio = document.getElementById("select-city");

	(pick === "Oyunlar") ? gamesRadio.checked = true
		: pick === "Filmler" ? moviesRadio.checked = true
			: citiesRadio.checked = true;

	resultDiv.innerHTML = pick;
	
	gamesRadio.disabled = true;
	gamesRadio.removeAttribute("onclick");
	moviesRadio.disabled = true;
	moviesRadio.removeAttribute("onclick");
	citiesRadio.disabled = true;
	citiesRadio.removeAttribute("onclick");
}

const writeAlphabet = () => {
	/*
		Alfabedeki bütün harfleri buton olarak ekrana yazdırır.
	*/
	const alphabet = document.getElementById("letters");
	for (let i = 0; i < chars.length; i++) {
		alphabet.innerHTML += "<button class='btn btn-primary' id='guess-" + chars[i] + "' onclick='guessLetter(\"" + chars[i] + "\")' style='margin-right: 5px; margin-bottom: 5px;'>" + chars[i] + "</button>";
	}
}

const getRandomItem = () => { 
	/*
		Seçilen kategoriden rastgele bir öge seçer.
	*/
	if (category === undefined) {
		alert("Lütfen bir kategori seçin!");
	} else {
		const display = document.getElementById("write-item");
		document.getElementById("start").disabled = true;
		const itemList = items[category];
		const randomIndex = Math.floor(Math.random() * itemList.length);
		selectedItem = itemList[randomIndex].toLowerCase();
		selectedItem = selectedItem.replace(/\s/g, '-');
		displayItem = selectedItem.replace(/[^\s-]/g, '_');
		for (let i = 0; i < displayItem.length; i++) {
			display.innerHTML += displayItem[i] + " ";
		}
		isStarted = true;
	}
}

const finishGame = () => {
	/*
		Oyunu bitirir. 
		Kazanılan oyun sayısını ve skoru arttırır.
		Oyun sayılarını ve skoru güncelleyip ekrana yazdırır.
		Oyunu sıfırlar.
	*/
	if (7 - lives === 0) {
		alert("Tebrikler! Hiç hata yapmadan kazandınız! +10 puan!");
		score += 10;
	} else if (7 - lives >= 1 && 7 - lives <= 5) {
		if (7 - lives === 1) {
			alert("Tebrikler! Sadece 1 hata ile kazandınız! +8 puan!");
			score += 5;
		} else if (7 - lives === 2) {
			alert("Tebrikler! Sadece 2 hata ile kazandınız! +6 puan!");
			score += 4;
		} else if (7 - lives === 3) {
			alert("Tebrikler! 3 hata ile kazandınız! +4 puan!");
			score += 3;
		} else if (7 - lives === 4) {
			alert("Tebrikler! 4 hata ile kazandınız! +2 puan!");
			score += 2;
		} else {
			alert("Tebrikler! 5 hata ile kazandınız! +1 puan!");
			score += 1;
		}
	} else {
		alert("Tebrikler! Kılpayı kazandınız :)");
	}
	score += calculateCorrectLetters(displayItem) * lives;
	document.getElementById("score").innerHTML = score;
	winCount++;
	gameCount++;
	displayCounts(gameCount, winCount, loseCount);
	reset();
}

const guessLetter = (letter) => { 
	/*
		param letter: Tahmin edilen harf

		Tahmin edilen harfi kontrol eder. 
		Eğer harf ögede varsa ekrana yazdırır. 
		Yoksa canı azaltır ve adamın bir parçasını çizer.
	*/
	if (!isStarted) {
		if (category === undefined)
			alert("Lütfen bir kategori seçin!");
		else
			alert("Lütfen oyunu başlatın!");
	} else {
		if (selectedItem.includes(letter)) {
			for(let i = 0; i < selectedItem.length; i++) {
				if (selectedItem[i] === letter) {
					displayItem = displayItem.substr(0, i) + letter + displayItem.substr(i + 1);
				}
			}
		} else {
			lives--;
			drawStickman();
		}

		const display = document.getElementById("write-item");
		display.innerHTML = "";
		for (let i = 0; i < displayItem.length; i++) {
			display.innerHTML += displayItem[i] + " ";
		}

		const guess = document.getElementById("guess-" + letter);
		guess.disabled = true;
		guess.removeAttribute("onclick");
		if (selectedItem === displayItem) {
			for (let i = 0; i < selectedItem.length; i++) {
				if (selectedItem[i] === letter) {
					displayItem = displayItem.substr(0, i) + letter + displayItem.substr(i + 1);
				}
			}

			setTimeout(() => {
				finishGame();
			}, 500);
		}
	}
}

const drawStickman = () => {
	/*
		Canı azalttıkça adamın bir parçasını çizer.
		Can bittiğinde oyunu kaybettirir.
		Oyun sayılarını günceller ve yazdırır.
		Oyunu sıfırlar.
	*/
	const canvas = document.getElementById('hangman');
	const ctx = canvas.getContext('2d');
	ctx.strokeStyle = "white";
	if (lives === 6) {
		ctx.beginPath();
		ctx.arc(175, 55, 15, 0, 2 * Math.PI);
		ctx.stroke();
	} else if (lives === 5) {
		ctx.moveTo(175, 70);
		ctx.lineTo(175, 95);
		ctx.stroke();
	} else if (lives === 4) {
		ctx.moveTo(175, 70);
		ctx.lineTo(155, 95);
		ctx.stroke();
	} else if (lives === 3) {
		ctx.moveTo(175, 70);
		ctx.lineTo(195, 95);
		ctx.stroke();
	} else if (lives === 2) {
		ctx.moveTo(175, 95);
		ctx.lineTo(175, 120);
		ctx.stroke();
	} else if (lives === 1) {
		ctx.moveTo(175, 120);
		ctx.lineTo(155, 145);
		ctx.stroke();
	} else {
		ctx.moveTo(175, 120);
		ctx.lineTo(195, 145);
		ctx.stroke();
		setTimeout(() => {
			alert("Kaybettiniz!");
			loseCount++;
			gameCount++;
			displayCounts(gameCount, winCount, loseCount);
			reset();
		}, 500);
		
	}
}

const calculateCorrectLetters = (item) => {
	/*
		param item: Seçilen öge

		Seçilen ögedeki doğru tahmin edilen harf sayısını hesaplar.
	*/
	let count = 0;
	for (let i = 0; i < item.length; i++) {
		if (item[i] !== '_' || item[i] !== '-')
			count++;
	}
	return count;
}

const reset = () => {
	/* 
		Oyunu skor ve oyun sayıları haricinde sıfırlar.
		Tüm değerleri ve butonları orijinal haline çevirir.
	*/
	category = undefined;
	isStarted = false;
	selectedItem = undefined;
	displayItem = undefined;
	guess = undefined;

	const resultDiv = document.getElementById("display-result");
	const gamesRadio = document.getElementById("select-game");
	const moviesRadio = document.getElementById("select-movie");
	const citiesRadio = document.getElementById("select-city");

	resultDiv.innerHTML = "";
	gamesRadio.checked = false;
	moviesRadio.checked = false;
	citiesRadio.checked = false;

	gamesRadio.disabled = false;
	gamesRadio.setAttribute("onclick", "pickCategory('Oyunlar')");
	moviesRadio.disabled = false;
	moviesRadio.setAttribute("onclick", "pickCategory('Filmler')");
	citiesRadio.disabled = false;
	citiesRadio.setAttribute("onclick", "pickCategory('Şehirler')");

	const display = document.getElementById("write-item");
	display.innerHTML = "";

	const alphabet = document.getElementById("letters");
	alphabet.innerHTML = "";

	const canvas = document.getElementById('hangman');
	const ctx = canvas.getContext('2d');
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	drawHanger();

	document.getElementById("start").disabled = false;
	lives = 7;

	writeAlphabet();
}