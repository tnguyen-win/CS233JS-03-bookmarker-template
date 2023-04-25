/* jshint esversion: 10 */

class Bookmarker {
	constructor() {
		try {
			this.bookmarks = JSON.parse(localStorage.bookmarks);
		} catch {
			this.bookmarks = [
				{ description: "DESCRIPTION GOES HERE", image: "./images/bookmark.png", link: "", title: "TITLE GOES HERE" },
			];
		}

		this.addEventHandlers = this.addEventHandlers.bind(this);
		this.fillBookmarks();
		this.addBookmark = this.addBookmark.bind(this);

		document.getElementsByClassName("floater-bottom")[0].children[0].onclick = this.addBookmark;
	}

	addBookmark() {
		const url = document.getElementById("url");
		const desc = document.getElementById("description");
		const urlV = url.value;
		const descV = desc.value;

		if (urlV == "") url.classList.add("is-invalid");
		if (descV == "") desc.classList.add("is-invalid");
		else if (urlV != "" && descV != "") {
			url.classList.remove("is-invalid");
			desc.classList.remove("is-invalid");

			const newBookmark = {
				description: descV,
				image: "IMAGE URL GOES HERE",
				link: urlV,
				title: "TITLE GOES HERE"
			};

			this.bookmarks.push(newBookmark);
			this.fillBookmarks();

			url.value = "";
		}
	}

	addEventHandlers() {
		const deleteIcons = document.getElementsByName("deleteBookmark");

		deleteIcons.forEach((d, i) => { d.onclick = this.deleteBookmark.bind(this, i); });
	}

	fillBookmarks() {
		localStorage.bookmarks = JSON.stringify(this.bookmarks);

		let bookmarksHtml = this.bookmarks.reduce((html, bookmark) => html += this.generateBookmarkHtml(bookmark), "");

		document.getElementsByClassName("bookmarks-list")[0].innerHTML = bookmarksHtml;

		this.addEventHandlers();
	}

	generateBookmarkHtml(bookmark) {
		return `
			<a href="${bookmark.link}" target="_blank" class="bookmark">
				<div class="img" style='background-image: url(${bookmark.image})'>
					&nbsp;
				</div>
				<div class="title">
					${bookmark.title}
					<br>
					${bookmark.description}
					</div>
				<div class="ms-auto">
					<i name="deleteBookmark" class="bi-trash delete-icon"></i>
				</div>
			</a>
		`;
	}

	deleteBookmark(index, event) {
		event.preventDefault();

		this.bookmarks.splice(index, 1);
		this.fillBookmarks();
	}
}

var bookmark;

window.onload = () => { bookmark = new Bookmarker(); };