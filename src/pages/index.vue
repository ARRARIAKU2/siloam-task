<script setup lang="ts">
import { ref, onMounted } from "vue";
import API from "../api.ts";

interface Vendor {
  id: string;
  vendorName: string;
  address: string;
}

const data = ref<Vendor[]>([]);
const dataVendor = ref<Vendor>();
const dialog = ref(false);
const dialogDelete = ref(false);
const editedIndex = ref<number>(-1);
const editedItem = ref<Vendor>({
  id: "",
  vendorName: "",
  address: "",
});
const defaultItem = ref<Vendor>({
  id: "",
  vendorName: "",
  address: "",
});

const headers = [
  { title: "ID", value: "id" },
  { title: "Vendor", value: "vendorName" },
  { title: "Address", value: "address" },
  { title: "Actions", key: "actions" },
];

// Fetch vendors from the API
const getVendors = async () => {
  try {
    const response = await API.getVendors(); // Assuming this returns the vendor data
    data.value = response.data; // Assign fetched data to `data`
  } catch (error) {
    console.error("Error fetching vendors:", error);
  }
};

// Call getVendors when the component is mounted
onMounted(() => {
  getVendors();
});

const addVendor = async (item: Vendor) => {
  try {
    const response = await API.createVendor(item); // Assuming this creates a vendor
    data.value.push(response.data); // Assign created vendor to `data`
    console.log(response);
  } catch (error) {
    console.error("Error creating vendor:", error);
  }
};

const updateVendor = async (id: string, editedItem: Vendor) => {
  try {
    const response = await API.updateVendor(id, editedItem); // Update vendor
    // Update local data array with the updated vendor
    data.value[editedIndex.value] = response.data;
  } catch (error) {
    console.error("Error updating vendor:", error);
  }
};

const deleteVendor = async (id: string) => {
  try {
    await API.deleteVendor(id); // Delete vendor from API
    // Remove vendor from the local data array
    data.value.splice(editedIndex.value, 1);
  } catch (error) {
    console.error("Error deleting vendor:", error);
  }
};

// Open the dialog for creating or editing an item
const editItem = (item: Vendor) => {
  editedIndex.value = data.value.indexOf(item);
  console.log(editedIndex.value);
  editedItem.value = { ...item };
  dialog.value = true;
};

// Open the delete confirmation dialog
const deleteItem = (item: Vendor) => {
  editedIndex.value = data.value.indexOf(item);
  editedItem.value = { ...item };
  dialogDelete.value = true;
};

// Confirm deletion of a vendor
const deleteItemConfirm = async () => {
  if (editedIndex.value > -1) {
    await deleteVendor(editedItem.value.id); // Perform deletion via API
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

// Save the edited vendor or add a new one
const save = async () => {
  if (editedIndex.value > -1) {
    // Update the vendor if it's an existing one
    await updateVendor(editedItem.value.id, editedItem.value);
  } else {
    // Create a new vendor
    await addVendor(editedItem.value);
  }
  close();
};
</script>

<template>
  <div class="p-4">
    <!-- Vendor Data Table -->
    <v-data-table
      :headers="headers"
      :items="data"
      item-key="id"
      items-per-page="10"
    >
      <!-- Top Toolbar with Add Button -->
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>Vendors</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            @click="editItem({ id: '', vendorName: '', address: '' })"
          >
            New Vendor
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
        <v-btn color="primary" @click="getVendors">Reload Vendors</v-btn>
      </template>
    </v-data-table>

    <!-- Edit Vendor Dialog -->
    <v-dialog v-model="dialog" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="text-h5">{{
            editedIndex === -1 ? "New Vendor" : "Edit Vendor"
          }}</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="editedItem.vendorName"
                  label="Vendor Name"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="editedItem.address"
                  label="Vendor Address"
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
          Are you sure you want to delete this vendor?
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
