// Model: Handles data and logic
class UserModel {
    constructor() {
        this.users = JSON.parse(localStorage.getItem('users')) || [];
    }

    createUser(user) {
        user.id = this.users.length ? this.users[this.users.length - 1].id + 1 : 1;
        user.created_at = new Date().toLocaleString();
        user.updated_at = new Date().toLocaleString();
        this.users.push(user);
        this.saveUsers();
    }
 
    readUser(id) {
        return this.users.find(user => user.id === id);
    }

    updateUser(updatedUser) {
        const index = this.users.findIndex(user => user.id === updatedUser.id);
        if (index !== -1) {
            updatedUser.updated_at = new Date().toLocaleString();
            this.users[index] = updatedUser;
            this.saveUsers();
        }
    }

    deleteUser(id) {
        this.users = this.users.filter(user => user.id !== id);
        this.saveUsers();
    }

    readAllUsers() {
        return this.users;
    }

    saveUsers() {
        localStorage.setItem('users', JSON.stringify(this.users));
    }
}

// Controller: Handles interactions
class UserController {
    constructor() {
        this.model = new UserModel();
        this.view = new UserView(this);
        this.view.renderUserTable(this.model.readAllUsers());
    }

    addUser(user) {
        this.model.createUser(user);
        this.view.renderUserTable(this.model.readAllUsers());
    }

    editUser(id) {
        const user = this.model.readUser(id);
        this.view.fillForm(user);
    }

    updateUser(user) {
        this.model.updateUser(user);
        this.view.renderUserTable(this.model.readAllUsers());
    }

    deleteUser(id) {
        this.model.deleteUser(id);
        this.view.renderUserTable(this.model.readAllUsers());
    }
}

// View: Handles display and user interaction
class UserView {
    constructor(controller) {
        this.controller = controller;
        document.getElementById('user-form').addEventListener('submit', (e) => this.handleFormSubmit(e));
    }

    renderUserTable(users) {
        const tbody = document.querySelector('#user-table tbody');
        tbody.innerHTML = '';
        users.forEach(user => {
            const row = `<tr>
                <td>${user.id}</td>
                <td>${user.name}</td>
                <td>${user.phone_number}</td>
                <td>${user.age}</td>
                <td>${user.gender}</td>
                <td>${user.gov_employee ? 'Yes' : 'No'}</td>
                <td>${user.district}</td>
                <td>${user.city}</td>
                <td>${user.state}</td>
                <td>
                    <button onclick="controller.editUser(${user.id})">Edit</button>
                    <button onclick="controller.deleteUser(${user.id})">Delete</button>
                </td>
            </tr>`;
            tbody.insertAdjacentHTML('beforeend', row);
        });
    }

    fillForm(user) {
        document.getElementById('user-id').value = user.id;
        document.getElementById('name').value = user.name;
        document.getElementById('phone_number').value = user.phone_number;
        document.getElementById('age').value = user.age;
        document.getElementById('gender').value = user.gender;
        document.getElementById('gov_employee').checked = user.gov_employee;
        document.getElementById('district').value = user.district;
        document.getElementById('city').value = user.city;
        document.getElementById('state').value = user.state;
    }

    handleFormSubmit(event) {
        event.preventDefault();
        const id = Number(document.getElementById('user-id').value);
        const user = {
            id,
            name: document.getElementById('name').value,
            phone_number: document.getElementById('phone_number').value,
            age: document.getElementById('age').value,
            gender: document.getElementById('gender').value,
            gov_employee: document.getElementById('gov_employee').checked,
            district: document.getElementById('district').value,
            city: document.getElementById('city').value,
            state: document.getElementById('state').value,
        };

        if (id) {
            this.controller.updateUser(user);
        } else {
            this.controller.addUser(user);
        }

        this.clearForm();
    }

    clearForm() {
        document.getElementById('user-form').reset();
        document.getElementById('user-id').value = '';
    }
}

// Initialize the application
const controller = new UserController();
