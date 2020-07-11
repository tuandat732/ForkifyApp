import axios from 'axios';

export default class Recipe {
    constructor(id) {
        this.id = id;
    }

    async getRecipe() {
        try {
            const res = await axios.get(`https://forkify-api.herokuapp.com/api/get?rId=${this.id}`);
            const { title, publisher, image_url, source_url, ingredients } = res.data.recipe;
            this.title = title;
            this.author = publisher;
            this.img = image_url;
            this.url = source_url;
            this.ingredients = ingredients;
        } catch (error) {
            console.log(error);
            alert('Something went wrong :(')
        }
    }

    calcTime() {
        // Assuming that we need 15 min for each 3 ingredients
        const numIng = this.ingredients.length;
        const periods = Math.ceil(numIng / 3);
        this.time = periods * 15;
    }

    calcServings() {
        this.servings = 4;
    }

    parseIngredients() {
        const unitsLong = ['tablespoons', 'tablespoon', 'ounces', 'ounce', 'teaspoons', 'teaspoon', 'cups', 'pounds']; // đơn vị sử dụng trong công thức nấu ăn, ex: 1 muỗng, 1 cup,..
        const unitsShort = ['tbsp', 'tbsp', 'oz', 'oz', 'tsp', 'tsp', 'cup', 'pound'];
        const units = [...unitsShort, 'kg', 'g'];

        const newIngredients = this.ingredients.map(el => {
            // 1. Uniform unit
            let ingredient = el.toLowerCase();
            unitsLong.forEach((unit, i) => {
                ingredient = ingredient.replace(unit, unitsShort[i]); // replace all unitLong in ingredient to unitShort
            })

            // 2. Remove parenthese - bỏ ngoặc
            ingredient = ingredient.replace(/ *\([^)]*\) */g, ' ')

            // 3. Parse ingredients into count, unit and ingredient
            /* Bài toán đặt ra:
                - Sửa lại dãy ingredient không có dạng cụ thể
                - Các trường hợp:
                    + 1 1/4 cup ....
                    + 1 cup...
                    + cup...
                => Thuật toán: chia chuỗi thành arr => find index của phần tử đầu tiên có giá trị là 1 trong các pt trong mảng unitShort => unitIndex
                    => các phần tử trước unitIndex là các số 1, 1/4,..
                => 3 th:
                    + nếu ko có số và các unit trong unitShort thì unitIndex=-1; 
                    + nếu có 1 số (ex: 1) và ko có unit thì là trường hợp arrIng[0] là number
                    + nếu 2 số thì là th còn lại
            */
            const arrIng = ingredient.split(' ');
            const unitIndex = arrIng.findIndex(el2 => units.includes(el2)); // tìm index đầu tiên trong list có sẵn

            let objIng;
            if (unitIndex > -1) {
                // There is a unit
                const arrCount = arrIng.slice(0, unitIndex); // Ex. 4 1/2 cups => arrCount is [4,1/2]

                let count;
                if (arrCount.length === 1) {
                    count = eval(arrIng[0].replace('-', '+'));
                } else {
                    count = eval(arrIng.slice(0, unitIndex).join('+')); // eval("4+1/2") = 4,5
                }

                objIng = {
                    count,
                    unit: arrIng[unitIndex],
                    ingredient: arrIng.slice(unitIndex + 1).join(' ')
                }

            } else if (parseInt(arrIng[0], 10)) {
                // There is NO unit, but the first element is a number
                objIng = {
                    count: parseInt(arrIng[0], 10),
                    unit: '',
                    ingredient: arrIng.slice(1).join(' '),
                }

            } else if (unitIndex === -1) {
                // There is NO unit and no Number
                objIng = {
                    count: 1,
                    unit: '',
                    ingredient
                }
            }

            return objIng;
        });
        this.ingredients = newIngredients;
    }
}