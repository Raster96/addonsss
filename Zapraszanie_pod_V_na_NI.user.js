// ==UserScript==
// @name         Zapraszanie pod "V" na NI (losowanie)
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Edycja dodatku autorstwa Arhq, który zapraszał wszystkich graczy z mapy. Dodatek zaprasza jedną (losową) osobę z mapy po kliknięciu "V" i zmienia kolor nicku zapraszanego gracza na "Gracze na mapie" dopóki nie zaakceptuje zaproszenia. W przypadku gdy zapraszany gracz znajduje się w innej grupie lub gdy ma inne niezaakceptowane zaproszenie, zaproszenie zostanie wysłane do kolejnego gracza.
// @author       You (edycja oryginalnego kodu autorstwa Arhq)
// @match        http*://*.margonem.pl/
// @exclude      http*://www.margonem.pl/
// @icon         https://www.google.com/s2/favicons?domain=margonem.pl
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    document.addEventListener("keyup", (ev) => {
        if (ev.keyCode === 86 && !["INPUT", "TEXTAREA", "MAGIC_INPUT"].includes(ev.target.tagName)) {
            const list = Object.entries(window.Engine.whoIsHere.getList()).filter(([_, { relation }]) =>
                ["cl", "fr", "cl-fr"].includes(relation)
            );

            const tryInvite = (remainingList) => {
                if (remainingList.length === 0) return;

                const [id] = remainingList[Math.floor(Math.random() * remainingList.length)];

                _g(`party&a=inv&id=${id}`, (data) => {
                    if (data.message) {
                        const element = document.querySelector(`div[data-id="${id}"] .center`);
                        if (element) {
                            element.style.color = "rgb(255, 0, 0)";
                        }
                    } else {
                        const updatedList = remainingList.filter(([otherId]) => otherId !== id);
                        tryInvite(updatedList);
                    }
                });
            };

            if (list.length > 0) {
                tryInvite(list);
            }
        }
    });
})();
