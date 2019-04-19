import React from "react";
import ReactDOM from "react-dom";

function randomBoolean() {
    return (Math.floor(Math.random()*2) % 2) == 0;
}

class BookRepository {
// TODO: metadata on how to unlock the achievements, authors, subtitles
  constructor(books, achievements) {
    this._books = books;
    this._achievements = achievements;
  }

  generateCompleteProgress() {
    return this._achievements.map(x => {
        return {
          bits: [],
          current: x.bits.length,
          done: true,
          id: x.achievementId,
          max: x.bits.length
        }
      });
  }

  // Generate random partial progress
  generatePartialProgress() {
    return this._achievements.map(achievement => {
        const maxBits = achievement.bits.length;
        var isDone = randomBoolean();
        var bits = [];
        var current = maxBits;
        if (!isDone) {
          for (var bit = 0; bit < maxBits; bit++) {
            var isBitSet = randomBoolean();
            if (isBitSet) {
              bits.push(bit);
            } else {
              current--;
            }
          }
          // Just in case it does turn out we did complete this achievement.
          if (current == maxBits) {
            isDone = true;
            bits = [];
          }
        }
        return {
          bits: bits,
          current: current,
          done: isDone,
          id: achievement.achievementId,
          max: maxBits
        }
      });
  }

  mapAchievementsToBooks(progression) {
    var achievements = {};
    this._achievements.forEach(x => achievements[x.achievementId] = x);

    var books = {};
    var output = [];
    this._books.forEach(x => {
      const book = {...x, status: "locked"};
      output.push(book);
      books[x.name] = book;
    });
    // TODO: book, paged, collation (multiple disparate things)

    // Populate books with their respective achievements.
    this._achievements.forEach(achievement => {
      achievement["bits"]
        .map((bit, index) => {
          var bookName = bit["book"];
            if (bookName) {
              var book = books[bookName];
              if (book == null) {
                console.log("Unable to find book with name: " + bookName);
              } else {
                if (bit["page"]) {
                  var page = book.text.find(x => x.page == bit.page);
                  page.achievement = achievement;
                } else {
                  books[bookName].achievement = achievement;
                }
              }
            }
          });
      if (achievement.unlockOnCompletion) {
        achievement.unlockOnCompletion.forEach(bit => {
          var bookName = bit["book"];
          books[bookName].text.find(x => x.page == bit.page).achievement = achievement;
        });
      }
    });

    progression.forEach(progress => {
      var achievement = achievements[progress.id];
      if (achievement == null) {
          return;
      }
      achievement["bits"]
        .map((bit, index) => {
          var isDone = progress.done || progress.bits.includes(index);
          var bookName = bit["book"];
          if (isDone) {
            if (bookName) {
              var book = books[bookName];
              if (bit["page"]) {
                  if (book == null) {
                      console.log("Unable to find book with name: " + bookName);
                  } else {
                      var page = book.text.find(x => x.page == bit.page).isUnlocked = true;
                  }
              } else {
                book.status = "complete";
              }
            }
          }
        });
      if (progress.done && achievement.unlockOnCompletion) {
        achievement.unlockOnCompletion.forEach(bit => {
          var bookName = bit["book"];
          books[bookName].text.find(x => x.page == bit.page).isUnlocked = true;
        });
      }
    });

    output.forEach(book => {
      if (book.type == "paged") {
        const unlockedPages = book.text.filter(x => x.isUnlocked).length;
        const isComplete = unlockedPages > 0
        if (unlockedPages == 0) {
          // remain locked
        } else if (unlockedPages == book.text.length) {
          book.status = "complete";
        } else {
          book.status = "partial";
        }
      } else if (book.type == "book-paged") {
        if (book.status == "complete") {
          book.text.forEach(x => x.isUnlocked = true);
        }
      }
    });
    return output;
  }
}

export default BookRepository;