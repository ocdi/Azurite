import {
  AccountSASPermissions,
  AccountSASResourceTypes,
  AccountSASServices
} from "@azure/storage-blob";

import Operation from "../generated/artifacts/operation";
import { AccountSASPermission } from "./AccountSASPermissions";
import { AccountSASResourceType } from "./AccountSASResourceTypes";
import { AccountSASService } from "./AccountSASServices";

export class OperationAccountSASPermission {
  constructor(
    public readonly service: string,
    public readonly resourceType: string,
    public readonly permission: string
  ) {}

  public validate(
    services: AccountSASServices | string,
    resourceTypes: AccountSASResourceTypes | string,
    permissions: AccountSASPermissions | string
  ): boolean {
    return (
      this.validateServices(services) &&
      this.validateResourceTypes(resourceTypes) &&
      this.validatePermissions(permissions)
    );
  }

  public validateServices(services: AccountSASServices | string): boolean {
    return services.toString().includes(this.service);
  }

  public validateResourceTypes(
    resourceTypes: AccountSASResourceTypes | string
  ): boolean {
    for (const p of this.resourceType) {
      if (resourceTypes.toString().includes(p)) {
        return true;
      }
    }
    return false;
  }

  public validatePermissions(
    permissions: AccountSASPermissions | string
  ): boolean {
    for (const p of this.permission) {
      if (permissions.toString().includes(p)) {
        return true;
      }
    }
    return false;
  }
}

// See https://docs.microsoft.com/en-us/rest/api/storageservices/constructing-an-account-sas
// TODO: Check all required operations
const OPERATION_ACCOUNT_SAS_PERMISSIONS = new Map<
  Operation,
  OperationAccountSASPermission
>();

OPERATION_ACCOUNT_SAS_PERMISSIONS.set(
  Operation.Service_GetProperties,
  new OperationAccountSASPermission(
    AccountSASService.Table,
    AccountSASResourceType.Service,
    AccountSASPermission.Read
  )
);

OPERATION_ACCOUNT_SAS_PERMISSIONS.set(
  Operation.Service_SetProperties,
  new OperationAccountSASPermission(
    AccountSASService.Table,
    AccountSASResourceType.Service,
    AccountSASPermission.Write
  )
);

OPERATION_ACCOUNT_SAS_PERMISSIONS.set(
  Operation.Service_GetStatistics,
  new OperationAccountSASPermission(
    AccountSASService.Table,
    AccountSASResourceType.Service,
    AccountSASPermission.Read
  )
);

OPERATION_ACCOUNT_SAS_PERMISSIONS.set(
  Operation.Table_Create,
  new OperationAccountSASPermission(
    AccountSASService.Table,
    AccountSASResourceType.Container,
    AccountSASPermission.Create + AccountSASPermission.Write
  )
);

OPERATION_ACCOUNT_SAS_PERMISSIONS.set(
  Operation.Table_SetAccessPolicy,
  new OperationAccountSASPermission(
    AccountSASService.Table,
    AccountSASResourceType.Container,
    "" // NOT ALLOWED
  )
);

OPERATION_ACCOUNT_SAS_PERMISSIONS.set(
  Operation.Table_GetAccessPolicy,
  new OperationAccountSASPermission(
    AccountSASService.Table,
    AccountSASResourceType.Container,
    "" // NOT ALLOWED
  )
);

OPERATION_ACCOUNT_SAS_PERMISSIONS.set(
  Operation.Table_Delete,
  new OperationAccountSASPermission(
    AccountSASService.Table,
    AccountSASResourceType.Container,
    AccountSASPermission.Delete
  )
);

OPERATION_ACCOUNT_SAS_PERMISSIONS.set(
  Operation.Table_Query,
  new OperationAccountSASPermission(
    AccountSASService.Table,
    AccountSASResourceType.Container,
    AccountSASPermission.List
  )
);

OPERATION_ACCOUNT_SAS_PERMISSIONS.set(
  Operation.Table_InsertEntity,
  new OperationAccountSASPermission(
    AccountSASService.Table,
    AccountSASResourceType.Object,
    // Create permission is only available for non existing block blob. Handle this scenario separately
    AccountSASPermission.Write + AccountSASPermission.Create
  )
);

OPERATION_ACCOUNT_SAS_PERMISSIONS.set(
  Operation.Table_MergeEntity,
  new OperationAccountSASPermission(
    AccountSASService.Table,
    AccountSASResourceType.Object,
    // Create permission is only available for non existing page blob. Handle this scenario separately
    AccountSASPermission.Write + AccountSASPermission.Create
  )
);

OPERATION_ACCOUNT_SAS_PERMISSIONS.set(
  Operation.Table_MergeEntityWithMerge,
  new OperationAccountSASPermission(
    AccountSASService.Table,
    AccountSASResourceType.Object,
    // Create permission is only available for non existing append blob. Handle this scenario separately
    AccountSASPermission.Write + AccountSASPermission.Create
  )
);

OPERATION_ACCOUNT_SAS_PERMISSIONS.set(
  Operation.Table_QueryEntities,
  new OperationAccountSASPermission(
    AccountSASService.Table,
    AccountSASResourceType.Object,
    AccountSASPermission.Read
  )
);

OPERATION_ACCOUNT_SAS_PERMISSIONS.set(
  Operation.Table_QueryEntitiesWithPartitionAndRowKey,
  new OperationAccountSASPermission(
    AccountSASService.Table,
    AccountSASResourceType.Object,
    AccountSASPermission.Read
  )
);

OPERATION_ACCOUNT_SAS_PERMISSIONS.set(
  Operation.Table_InsertEntity,
  new OperationAccountSASPermission(
    AccountSASService.Table,
    AccountSASResourceType.Object,
    AccountSASPermission.Write
  )
);

OPERATION_ACCOUNT_SAS_PERMISSIONS.set(
  Operation.Table_Delete,
  new OperationAccountSASPermission(
    AccountSASService.Table,
    AccountSASResourceType.Object,
    AccountSASPermission.Delete
  )
);

OPERATION_ACCOUNT_SAS_PERMISSIONS.set(
  Operation.Table_DeleteEntity,
  new OperationAccountSASPermission(
    AccountSASService.Table,
    AccountSASResourceType.Object,
    AccountSASPermission.Delete + AccountSASPermission.Write
  )
);

export default OPERATION_ACCOUNT_SAS_PERMISSIONS;
