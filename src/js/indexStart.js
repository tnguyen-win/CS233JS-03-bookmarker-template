/* jshint esversion: 10 */
class Bookmarker {
	constructor() {
		try {
			this.bookmarks = JSON.parse(localStorage.bookmarks);
		} catch {
			this.bookmarks = [{
				description: "DESCRIPTION GOES HERE",
				image: "./images/bookmark.png",
				link: "",
				title: "TITLE GOES HERE"
			},];
		}

		this.addEventHandlers = this.addEventHandlers.bind(this);
		this.fillBookmarks();
		this.addBookmark = this.addBookmark.bind(this);
		this.apiUrl = "https://opengraph.io/api/1.1/site";
		this.appId = "fbc0d09c-b334-455b-aa86-bcb0a1714968";

		document.getElementsByClassName("floater-bottom")[0].children[0].onclick = this.addBookmark;
	}

	addBookmark(e) {
		e.preventDefault();

		const eUrl = document.getElementById("url");
		const eDesc = document.getElementById("description");
		const vUrl = eUrl.value;
		const vDesc = eDesc.value;
		const uURL = encodeURIComponent(vUrl);

		if (vUrl == "") eUrl.classList.add("is-invalid");
		if (vDesc == "") eDesc.classList.add("is-invalid");

		if (vUrl != "" && vDesc != "") {
			eUrl.classList.remove("is-invalid");
			eDesc.classList.remove("is-invalid");

			fetch(`${this.apiUrl}/${uURL}?app_id=${this.appId}`)
				.then((res) => res.ok ? res.json() : (() => { throw new Error(res.status); })())
				.then(data => {
					const newBookmark = {
						description: vDesc,
						image: data.hybridGraph.image,
						link: vUrl,
						title: data.hybridGraph.title
					};

					this.bookmarks.push(newBookmark);
					this.fillBookmarks();

					document.querySelector(".bookmark-form").reset();
				})
				.catch(e => {
					alert("There was a problem getting information. See the console for further details.");
					console.log(`FETCH ERROR: ${e}`);
				});

		}
	}

	addEventHandlers() {
		const deleteIcons = document.getElementsByName("deleteBookmark");
		const formInputs = document.getElementsByTagName("input");

		deleteIcons.forEach((d, i) => d.onclick = this.deleteBookmark.bind(this, i));

		for (let d in formInputs) if (formInputs[d].tagName === "INPUT") formInputs[d].onfocus = () => document.body.classList.add("show-floater");

		document.onclick = e => {
			if (!e.target.closest("#url") && !e.target.closest("#description")) document.body.classList.remove("show-floater");
		};
	}

	fillBookmarks() {
		localStorage.bookmarks = JSON.stringify(this.bookmarks);

		let bookmarksHtml = this.bookmarks.reduce((h, b) => h += this.generateBookmarkHtml(b), "");

		document.getElementsByClassName("bookmarks-list")[0].innerHTML = bookmarksHtml;

		this.addEventHandlers();
	}

	generateBookmarkHtml(b) {
		return `
		<a href="${b.link}" target="_blank" class="bookmark">
			<div class="img" style='background-image: url("${b.image}")'>
				&nbsp;
			</div>
			<div class="title">
				${b.title}
				<br>
				${b.description}
				</div>
			<div class="ms-auto">
				<i name="deleteBookmark" class="bi-trash delete-icon"></i>
			</div>
		</a>
		`;
	}

	deleteBookmark(i, e) {
		e.preventDefault();

		this.bookmarks.splice(i, 1);
		this.fillBookmarks();
	}
}

var bookmark;

window.onload = () => bookmark = new Bookmarker();