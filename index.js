const $ = (el) => document.querySelector(el);
const $$ = (el) => document.querySelectorAll(el);
const $table = $("table");
const $head = $("thead");
const $body = $("tbody");

const rows = 10;
const columns = 5;
const first_char_code = 65;

const range = (length) => Array.from({ length }, (_, i) => i);
const getColumns = (i) => String.fromCharCode(first_char_code + i);

let STATE = range(columns).map((i) =>
  range(rows).map((j) => ({ computedValue: 0, value: 0 }))
);

function updateCell({ x, y, value }) {
    const newState = structuredClone(STATE);
    const cell = newState[x][y];
    cell.value = value;
    cell.computedValue = computedValue(value);

    newState[x][y] = cell;

    STATE = newState;

    renderSpreadSheet();
}

function computedValue(value) {
    if (!value.startsWith("=")) return value;

    const formula = value.slice(1)

    let computedValue
    try {    
        computedValue = eval(formula)
    } catch (error) {
        computedValue = `ERROR: ${error.message}`
    }

    return computedValue
}
const renderSpreadSheet = () => {
  const headerHTML = `<tr>
    <th></th>
    ${range(columns)
      .map((i) => `<th>${getColumns(i)}</th>`)
      .join("")}
    </tr>`;
  $head.innerHTML = headerHTML;

  const bodyHTML = range(rows)
    .map((row) => {
      return `<tr>
    <td>${row + 1}</td>
    ${range(columns)
      .map(
        (column) => `
        <td data-x="${column}" data-y="${row}">
        <span>${STATE[column][row].computedValue}</span>
        <input type="text" value="${STATE[column][row].value}"/>
        </td>`
      )
      .join("")}
    </tr>`;
    })
    .join("");

  $body.innerHTML = bodyHTML;
};

$body.addEventListener("click", event => {
    const td = event.target.closest("td");
    if (!td) return;
    const { x, y } = td.dataset;
    const input = td.querySelector("input");
    const span = td.querySelector("span");

    const end = input.value.length
    input.setSelectionRange(end, end)
    input.focus()

    input.addEventListener("keydown", (event) => {
        if (event.key === "Enter") input.blur()
    })

    input.addEventListener("blur", () => {
        if (input.value === STATE[x][y].value) return;
            
        updateCell({x, y, value: input.value});
    }, { once: true });
})

renderSpreadSheet();
