const url = "question.json";
let nowQuestion = 0;
let correctQuestions = [];
let incorrectQuestions = [];
let askedQuestions = [];


let questions;
$.getJSON(url, function(data){
    questions = data;
});

$(function () {
    const $home = $(".home");
    const $question = $(".question");
    const $startButton = $(".start");

    $home.css("display", "flex")
    $startButton.click(function () {
        $(".question .main").html(generateQuestion());
        addListener();

        $home.css("display", "none");
        $question.css("display", "flex");
        $(".box_answer").eq(0).focus();
    });
});


function generateQuestion() {
    let r;
    let q;
    while (true) {
        r = Math.floor(Math.random() * questions.length);
        q = questions[r];
        if (!askedQuestions.includes(r)) break;
    }

    let htmlBuilder = "";
    htmlBuilder += `<p>${q.Index}</p>\n<h1>${q.Jp}</h1><div class="box">`

    const en = q.En.split(" ")
    for (let i in en) {
        if (en[i] === "~") {
            htmlBuilder += "<p>~</p>\n"
        } else if(en[i] === "...") {
            htmlBuilder += "<p>...</p>\n"
        } else if(en[i] === "one") {
                htmlBuilder += "<p>one</p>\n"
        } else if(en[i] === "?") {
            htmlBuilder += "<p>?</p>\n"
        } else {
            htmlBuilder += `<div>\n<input type="text" class="box_answer" data-answer="${q.En}">\n<img class="correct" src="correct.svg"><img class="incorrect" src="incorrect.svg">\n</div>\n`
        }
    }
    htmlBuilder += "</div>"
    htmlBuilder += `<p class="answer">解答: ${q.En}</p>`
    htmlBuilder += "<button class=\"submit\">回答</button>"

    if (askedQuestions.length + 1 === questions.length) {
        htmlBuilder += "<button class=\"result\">結果</button>"
    } else {
        htmlBuilder += "<button class=\"next\">次へ</button>"
    }

    nowQuestion = r
    return htmlBuilder
}

function addListener() {
    $(".submit").click(function () {
        const q = questions[nowQuestion];
        const en = q.En.split(" ");

        let counter = 0;
        let answer = [];
        for (let i in en) {
            if (en[i] === "~" || en[i] === "..." || en[i] === "one" || en[i] === "?") continue;

            const input = $(".box_answer").eq(counter);
            if (input.val() === en[i]) {
                input.parent().find(".correct").css("display", "block");
                answer.push(true);
            } else {
                input.parent().find(".incorrect").css("display", "block");
                answer.push(false);
            }

            counter ++;
        }

        if (answer.includes(false)) {
            incorrectQuestions.push(nowQuestion);
        } else {
            correctQuestions.push(nowQuestion);
        }
        askedQuestions.push(nowQuestion)

        $(this).css("display", "none");
        $(".next").css("display", "block");
        $(".answer").css("display", "block");
        $(".result").css("display", "block");

        $(document).keypress(function(e) {
            if (e.code == "Enter") {
                $(document).off();
                $(".next").click();
            }
        });

        $(".next").click(function () {
            const $home = $(".home");
            const $question = $(".question");

            $(".question .main").html(generateQuestion());
            addListener();

            $home.css("display", "none");
            $question.css("display", "flex");
            $(".box_answer").eq(0).focus();
        });
    });

    $(document).keypress(function(e) {
        if (e.code == "Enter") {
            $(document).off();
            $(".submit").click();
        }
    });

    $(".result").click(function () {
        const html = `<h1>正解数: ${correctQuestions.length}</h1>\n<h1>不正解数: ${incorrectQuestions.length}</h1>`
        $(".res .main").html(html);

        $(".question").css("display", "none");
        $(".res").css("display", "block");
    })
}