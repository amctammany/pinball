class Person {
  constructor({ name, age }) {
    this.name = name;
    this.age = age;
  }

  getData() {
    return `${this.name} & ${this.age}`;
  }
}

const personData = { name: "Alex", age: "30ish" };
window.onload = () => {
  const p = new Person(personData);
  const node = document.createElement("b");
  node.innerHTML = p.getData();

  window.setTimeout(() => document.body.appendChild(node), 1000);
};

export default Person;
