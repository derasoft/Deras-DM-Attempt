const hbs = require('handlebars');
// const express = require('express');

module.exports = {
    listOfModules: function(inp) {
        let undoubling = {};
        for (let c of inp) {
            if (c === undefined) continue
            else undoubling[c.id] = c.name;
        }
        let outp = ``;
        for (let c in undoubling) {
            outp += `<li><a href="/module/${c}">${undoubling[c]}</a></li>`;
        }
        outp = `<ul>${outp}</ul>`;
        return outp;
    },
    listOfTags: function(inp) {
        let outp = ``
        for (let c in inp) {
            outp += inp[c] + ', ';
        }
        return outp;
    },
    listOfPosts: function(inp) {
        let outp = ``;
        for (let c of inp) {
            outp += `<div class="post">${c.content}</div>`;
        }
        return outp;
    },
}