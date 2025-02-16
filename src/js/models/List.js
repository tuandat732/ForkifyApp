import uniqid from "uniqid";

export default class List {
    constructor() {
        this.items = [];
    }

    addItem(count, unit, ingredient) {
        const item = {
            id: uniqid(),
            count,
            unit,
            ingredient
        }
        this.items.push(item);
        return item;
    }

    deleteItem(id) {
        const index = this.items.findIndex(el => el.id === id);
        // [2,4,8] splice(1,2) => return [4,8], original arr is [2]
        // [2,4,8] slice(1,2) => return 4, original arr is [2,4,8]
        this.items.splice(index, 1);
    }

    updateCount(id, newCount) {
        this.items.find(el => el.id === id).count = newCount;
        // NOTE: array.find trả về giá trị và giá trị này khi thay đổi thì ptu đó trong arr cx thay đổi theo
    }
}