<script setup lang="ts">
import { ref, onMounted } from "vue";
import API from "../api.ts";

interface User {
  id: string;
  name: string;
  email: string;
  password: string;
}

const data = ref<User[]>([]); // Change to User[]
const dataUser = ref<User>(); // Change to User
const dialog = ref(false);
const dialogDelete = ref(false);
const editedIndex = ref<number>(-1);
const editedItem = ref<User>({
  id: "",
  name: "",
  email: "",
  password: "",
});
const defaultItem = ref<User>({
  id: "",
  name: "",
  email: "",
  password: "",
});

const headers = [
  { title: "ID", value: "id" },
  { title: "Name", value: "name" },
  { title: "Email", value: "email" },
  { title: "Password", value: "password" },
  { title: "Actions", key: "actions" },
];

// Fetch users from the API
const getUsers = async () => {
  try {
    const response = await API.getUsers(); // Assuming this returns the user data
    data.value = response.data; // Assign fetched data to `data`
  } catch (error) {
    console.error("Error fetching users:", error);
  }
};

// Call getUsers when the component is mounted
onMounted(() => {
  getUsers();
});

const addUser = async (item: User) => {
  try {
    const response = await API.createUser(item); // Assuming this creates a user
    data.value.push(response.data); // Assign created user to `data`
  } catch (error) {
    console.error("Error creating user:", error);
  }
};

const updateUser = async (id: string, editedItem: User) => {
  try {
    const response = await API.updateUser(id, editedItem); // Update user
    // Update local data array with the updated user
    data.value[editedIndex.value] = response.data;
  } catch (error) {
    console.error("Error updating user:", error);
  }
};

const deleteUser = async (id: string) => {
  try {
    await API.deleteUser(id); // Delete user from API
    // Remove user from the local data array
    data.value.splice(editedIndex.value, 1);
  } catch (error) {
    console.error("Error deleting user:", error);
  }
};

// Open the dialog for creating or editing an item
const editItem = (item: User) => {
  editedIndex.value = data.value.indexOf(item);
  console.log(editedIndex.value);
  editedItem.value = { ...item };
  dialog.value = true;
};

// Open the delete confirmation dialog
const deleteItem = (item: User) => {
  editedIndex.value = data.value.indexOf(item);
  editedItem.value = { ...item };
  dialogDelete.value = true;
};

// Confirm deletion of a user
const deleteItemConfirm = async () => {
  if (editedIndex.value > -1) {
    await deleteUser(editedItem.value.id); // Perform deletion via API
  }
  closeDelete();
};

// Close the dialog
const close = () => {
  dialog.value = false;
  editedItem.value = { ...defaultItem.value };
  editedIndex.value = -1;
};

// Close the delete dialog
const closeDelete = () => {
  dialogDelete.value = false;
  editedItem.value = { ...defaultItem.value };
  editedIndex.value = -1;
};

// Save the edited user or add a new one
const save = async () => {
  if (editedIndex.value > -1) {
    // Update the user if it's an existing one
    await updateUser(editedItem.value.id, editedItem.value);
  } else {
    // Create a new user
    await addUser(editedItem.value);
  }
  close();
};
</script>

<template>
  <div class="p-4">
    <!-- User Data Table -->
    <v-data-table
      :headers="headers"
      :items="data"
      item-key="id"
      items-per-page="10"
    >
      <!-- Top Toolbar with Add Button -->
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>Users</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            @click="editItem({ id: '', name: '', email: '', password: '' })"
          >
            New User
          </v-btn>
        </v-toolbar>
      </template>

      <!-- Action Buttons in Each Row -->
      <template v-slot:item.actions="{ item }">
        <v-icon class="me-2" size="small" @click="editItem(item)"
          >mdi-pencil</v-icon
        >
        <v-icon size="small" @click="deleteItem(item)">mdi-delete</v-icon>
      </template>

      <!-- No Data Message -->
      <template v-slot:no-data>
        <v-btn color="primary" @click="getUsers">Reload Users</v-btn>
      </template>
    </v-data-table>

    <!-- Edit User Dialog -->
    <v-dialog v-model="dialog" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="text-h5">{{
            editedIndex === -1 ? "New User" : "Edit User"
          }}</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="editedItem.name"
                  label="User Name"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="editedItem.email"
                  label="Email"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="editedItem.password"
                  label="Password"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue-darken-1" variant="text" @click="close"
            >Cancel</v-btn
          >
          <v-btn color="blue-darken-1" variant="text" @click="save">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Delete Confirmation Dialog -->
    <v-dialog v-model="dialogDelete" max-width="500px">
      <v-card>
        <v-card-title class="text-h5">
          Are you sure you want to delete this User?
        </v-card-title>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue-darken-1" variant="text" @click="closeDelete"
            >Cancel</v-btn
          >
          <v-btn color="blue-darken-1" variant="text" @click="deleteItemConfirm"
            >OK</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
