# Create Resource Group
resource "azurerm_resource_group" "front_end_rg" {
  name     = "rg-frontend-sand-ne-001"
  location = "northeurope"
}

# Create Storage Account
resource "azurerm_storage_account" "front_end_storage_account" {
  name     = "stgflowerfrontendne001"
  location = "northeurope"

  account_replication_type = "LRS"
  account_tier             = "Standard"
  account_kind             = "StorageV2"
  resource_group_name      = azurerm_resource_group.front_end_rg.name

  static_website {
    index_document = "index.html"
  }
}
