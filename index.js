const person = {
    Rahul: 18,

    Raj: 19,

    kunal : 9,

    Abhi: 17,

    Ajay: 25,

    Arjun: 68,

    Brijesh: 32,

    mehfooz: 19,

    arnav: 33
};


// expected output
// ["Rahul", "Raj","Ajay", "Brijesh", "Arjun"]

// ["Rahul", "raj", "mefooz", "ajay", "brijesh", "Arna", "Arjun"]

const res = [];

for (const key in person) {
    if (person[key] >= 18) {
        res.push({name: key, age: person[key]});
    }

    
}

const result = res.sort((a, b) => a.age - b.age); 

console.log(result);

