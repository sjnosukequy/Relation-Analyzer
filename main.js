const text_input = document.getElementById("text_input");
const output = document.getElementById("output");
const result = document.getElementById("result");
const reflexive = document.getElementById("reflexive");
const symmetric = document.getElementById("symmetric");
const antisymmetric = document.getElementById("antisymmetric");
const transitive = document.getElementById("transitive");
const reason = document.getElementById("reason");

var relation = [];
var max = 0
var min = 0
var isReflexive = true
var isSymmetric = true
var isAntisymmetric = true
var isTransitive = true
var relation_dict = {}

var reflexive_reason = ''
var symmetric_reason = ''
var transitive_reason = ''
var antisymmetric_reason = ''

text_input.addEventListener("input", (e) => {
    reset()
    var text = e.target.value.trim();
    output.innerText = text;
    try {
        text = text.replaceAll('(', '[')
        text = text.replaceAll(')', ']')
        text = '[' + text + ']'
        relation = JSON.parse(text)
        // VALID CHECK
        for (let i in relation) {
            if (!Array.isArray(relation[i]))
                throw "Invalid Relation"

            if (relation[i].length != 2)
                throw "Invalid Relation"

            relation_dict[relation[i].toString()] = true

            if (relation[i][0] > max)
                max = relation[i][0]
            if (relation[i][1] > max)
                max = relation[i][1]

            // SET LOWER BOUND TO MIN
            if (i == 0)
                min = relation[i][0]
            if (relation[i][0] < min)
                min = relation[i][0]
            if (relation[i][1] < min)
                min = relation[i][1]
        }
        text_input.classList.remove("input-error")
        text_input.classList.remove("bg-error")
        analyze()
    } catch (err) {
        text_input.classList.add("input-error")
        text_input.classList.add("bg-error")
    }
})

function reset() {
    max = 0
    min = 0
    relation = []
    isReflexive = true
    isSymmetric = true
    isAntisymmetric = true
    isTransitive = true
    relation_dict = {}
    reflexive_reason = ''
    symmetric_reason = ''
    transitive_reason = ''
    antisymmetric_reason = ''
    reason.innerText = ''
}

function analyze() {
    relation = relation.sort()
    reflexive_number = max - min + 1
    reflexive_count = 0
    reflexive_check_list = []

    check_reflexive = false
    check_symmetric = false
    check_antisymmetric = false
    check_transitive = false

    for (let i = 0; i < relation.length; i++) {
        isEqual = false
        // Checking reflexive
        if (relation[i][0] == relation[i][1] && relation[i][0] >= min && relation[i][0] <= max) {
            reflexive_count++
            console.log(reflexive_count)
            isEqual = true
            reflexive_check_list.push(relation[i][0])
            check_reflexive = true
        }
        for (let k = 0; k < relation.length; k++) {
            if (true) {
                let ikey = relation[i][1] + ',' + relation[i][0]
                if (!relation_dict[ikey]) {
                    // Checking symmetric
                    isSymmetric = false
                    symmetric_reason = `Symmetric: (${relation[i]}) exists but not (${relation[i][1].toString()}, ${relation[i][0].toString()})`
                }
                else {
                    // Checking antisymmetric
                    if (relation[i][0] != relation[i][1]) {
                        antisymmetric_reason = `Antisymmetric: (${relation[i]}) exists but (${relation[i][1]},${relation[i][0]}) exists`
                        isAntisymmetric = false
                    }
                }
                check_symmetric = true
                check_antisymmetric = true    
            }
            if (k != i)
                if (relation[i][1] == relation[k][0]) {
                    let key = relation[i][0] + ',' + relation[k][1]
                    // Checking transitive
                    if (!relation_dict[key]) {
                        transitive_reason = `Transitive: (${relation[i]}) and (${relation[k]}) exists but (${key}) not found`
                        isTransitive = false
                    }
                    check_transitive = true
                }
        }
    }
    if (reflexive_count != reflexive_number || !check_reflexive) {
        isReflexive = false
        check_reflexive = true
        let reason = ''
        for (let i = 1; i <= max; i++) {
            if (!reflexive_check_list.includes(i)) {
                reason += `(${i}, ${i}), `
            }
        }
        reflexive_reason = `Reflexive: ${reason} does not exist`
    }
    UpdateState(reflexive, isReflexive, reflexive_reason, check_reflexive)
    UpdateState(symmetric, isSymmetric, symmetric_reason, check_symmetric)
    UpdateState(antisymmetric, isAntisymmetric, antisymmetric_reason, check_antisymmetric)
    UpdateState(transitive, isTransitive, transitive_reason, check_transitive)
}
function UpdateState(node, state, reason_text, check) {
    if (!check) {
        node.className = "text-sm md:text-base font-bold p-3 px-5 bg-primary-content text-primary rounded rounded-lg"
        return
    }

    node.classList.remove("bg-primary-content", "text-primary")
    node.classList.add("text-white")
    if (state) {
        node.classList.remove("bg-error")
        node.classList.add("bg-success")
    } else {
        node.classList.add("bg-error")
        node.classList.remove("bg-success")
        if (reason.innerText == '')
            reason.innerText = `Reason: \n`
        reason.innerText += reason_text + '\n'
    }
}