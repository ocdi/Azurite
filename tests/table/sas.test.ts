import { TableService } from "azure-storage";

import * as assert from "assert";

import { configLogger } from "../../src/common/Logger";
import TableTestServerFactory from "../TableTestServerFactory";
import { EMULATOR_ACCOUNT_KEY, EMULATOR_ACCOUNT_NAME } from "../testutils";

// Set true to enable debug log
configLogger(false);

describe("Shared Access Signature (SAS) authentication", () => {
  const factory = new TableTestServerFactory();
  const server = factory.createServer();

  const service = new TableService(EMULATOR_ACCOUNT_NAME, EMULATOR_ACCOUNT_KEY);
  const rsas = service.generateSharedAccessSignature("test", {
    AccessPolicy: { Permissions: "r" }
  });

  const baseURL = `http://${server.config.host}:${server.config.port}/devstoreaccount1`;

  before(async () => {
    await server.start();
  });

  after(async () => {
    await server.close();
    await server.clean();
  });

  it("should work @loki", async () => {
    assert.equal(baseURL, rsas);
  });

  // it("generateAccountSASQueryParameters should work @loki @sql", async () => {
  //   const now = new Date();
  //   now.setMinutes(now.getMinutes() - 5); // Skip clock skew with server

  //   const tmr = new Date();
  //   tmr.setDate(tmr.getDate() + 1);

  //   // By default, credential is always the last element of pipeline factories
  //   const factories = serviceURL.pipeline.factories;
  //   const sharedKeyCredential = factories[factories.length - 1];

  //   const sas = generateAccountSASQueryParameters(
  //     {
  //       expiryTime: tmr,
  //       ipRange: { start: "0.0.0.0", end: "255.255.255.255" },
  //       permissions: AccountSASPermissions.parse("rwdlacup").toString(),
  //       protocol: SASProtocol.HTTPSandHTTP,
  //       resourceTypes: AccountSASResourceTypes.parse("sco").toString(),
  //       services: AccountSASServices.parse("btqf").toString(),
  //       startTime: now,
  //       version: "2016-05-31"
  //     },
  //     sharedKeyCredential as SharedKeyCredential
  //   ).toString();

  //   const sasURL = `${serviceURL.url}?${sas}`;
  //   const serviceURLWithSAS = new ServiceURL(
  //     sasURL,
  //     StorageURL.newPipeline(new AnonymousCredential())
  //   );

  //   await serviceURLWithSAS.getAccountInfo(Aborter.none);
  // });

  // it("generateAccountSASQueryParameters should work for set table tier @loki @sql", async () => {
  //   const now = new Date();
  //   now.setMinutes(now.getMinutes() - 5); // Skip clock skew with server

  //   const tmr = new Date();
  //   tmr.setDate(tmr.getDate() + 1);

  //   // By default, credential is always the last element of pipeline factories
  //   const factories = serviceURL.pipeline.factories;
  //   const sharedKeyCredential = factories[factories.length - 1];

  //   const sas = generateAccountSASQueryParameters(
  //     {
  //       expiryTime: tmr,
  //       ipRange: { start: "0.0.0.0", end: "255.255.255.255" },
  //       permissions: AccountSASPermissions.parse("w").toString(),
  //       protocol: SASProtocol.HTTPSandHTTP,
  //       resourceTypes: AccountSASResourceTypes.parse("sco").toString(),
  //       services: AccountSASServices.parse("btqf").toString(),
  //       startTime: now,
  //       version: "2016-05-31"
  //     },
  //     sharedKeyCredential as SharedKeyCredential
  //   ).toString();

  //   const sasURL = `${serviceURL.url}?${sas}`;
  //   const serviceURLWithSAS = new ServiceURL(
  //     sasURL,
  //     StorageURL.newPipeline(new AnonymousCredential())
  //   );

  //   const containerURLWithSAS = ContainerURL.fromServiceURL(
  //     serviceURLWithSAS,
  //     getUniqueName("con")
  //   );
  //   await containerURLWithSAS.create(Aborter.none);

  //   const blockTableURLWithSAS = BlockTableURL.fromContainerURL(
  //     containerURLWithSAS,
  //     getUniqueName("table")
  //   );
  //   await blockTableURLWithSAS.upload(Aborter.none, "abc", 3);

  //   await blockTableURLWithSAS.setTier(Aborter.none, "Hot");
  // });

  // it("generateAccountSASQueryParameters should not work with invalid permission @loki @sql", async () => {
  //   const tmr = new Date();
  //   tmr.setDate(tmr.getDate() + 1);

  //   // By default, credential is always the last element of pipeline factories
  //   const factories = serviceURL.pipeline.factories;
  //   const sharedKeyCredential = factories[factories.length - 1];

  //   const sas = generateAccountSASQueryParameters(
  //     {
  //       expiryTime: tmr,
  //       permissions: AccountSASPermissions.parse("wdlcup").toString(),
  //       resourceTypes: AccountSASResourceTypes.parse("sco").toString(),
  //       services: AccountSASServices.parse("btqf").toString()
  //     },
  //     sharedKeyCredential as SharedKeyCredential
  //   ).toString();

  //   const sasURL = `${serviceURL.url}?${sas}`;
  //   const serviceURLWithSAS = new ServiceURL(
  //     sasURL,
  //     StorageURL.newPipeline(new AnonymousCredential())
  //   );

  //   let error;
  //   try {
  //     await serviceURLWithSAS.getProperties(Aborter.none);
  //   } catch (err) {
  //     error = err;
  //   }

  //   assert.ok(error);
  // });

  // it("generateAccountSASQueryParameters should not work with invalid service @loki @sql", async () => {
  //   const tmr = new Date();
  //   tmr.setDate(tmr.getDate() + 1);

  //   // By default, credential is always the last element of pipeline factories
  //   const factories = serviceURL.pipeline.factories;
  //   const sharedKeyCredential = factories[factories.length - 1];

  //   const sas = generateAccountSASQueryParameters(
  //     {
  //       expiryTime: tmr,
  //       permissions: AccountSASPermissions.parse("rwdlacup").toString(),
  //       resourceTypes: AccountSASResourceTypes.parse("sco").toString(),
  //       services: AccountSASServices.parse("tqf").toString()
  //     },
  //     sharedKeyCredential as SharedKeyCredential
  //   ).toString();

  //   const sasURL = `${serviceURL.url}?${sas}`;
  //   const serviceURLWithSAS = new ServiceURL(
  //     sasURL,
  //     StorageURL.newPipeline(new AnonymousCredential())
  //   );

  //   let error;
  //   try {
  //     await serviceURLWithSAS.getProperties(Aborter.none);
  //   } catch (err) {
  //     error = err;
  //   }

  //   assert.ok(error);
  // });

  // it("generateAccountSASQueryParameters should not work with invalid resource type @loki @sql", async () => {
  //   const tmr = new Date();
  //   tmr.setDate(tmr.getDate() + 1);

  //   // By default, credential is always the last element of pipeline factories
  //   const factories = serviceURL.pipeline.factories;
  //   const sharedKeyCredential = factories[factories.length - 1];

  //   const sas = generateAccountSASQueryParameters(
  //     {
  //       expiryTime: tmr,
  //       ipRange: { start: "0.0.0.0", end: "255.255.255.255" },
  //       permissions: AccountSASPermissions.parse("rwdlacup").toString(),
  //       protocol: SASProtocol.HTTPSandHTTP,
  //       resourceTypes: AccountSASResourceTypes.parse("co").toString(),
  //       services: AccountSASServices.parse("btqf").toString(),
  //       version: "2016-05-31"
  //     },
  //     sharedKeyCredential as SharedKeyCredential
  //   ).toString();

  //   const sasURL = `${serviceURL.url}?${sas}`;
  //   const serviceURLWithSAS = new ServiceURL(
  //     sasURL,
  //     StorageURL.newPipeline(new AnonymousCredential())
  //   );

  //   let error;
  //   try {
  //     await serviceURLWithSAS.getProperties(Aborter.none);
  //   } catch (err) {
  //     error = err;
  //   }

  //   assert.ok(error);
  // });

  // it("Copy table should work with write permission in account SAS to override an existing table @loki", async () => {
  //   const tmr = new Date();
  //   tmr.setDate(tmr.getDate() + 1);

  //   // By default, credential is always the last element of pipeline factories
  //   const factories = serviceURL.pipeline.factories;
  //   const sharedKeyCredential = factories[factories.length - 1];

  //   const sas = generateAccountSASQueryParameters(
  //     {
  //       expiryTime: tmr,
  //       ipRange: { start: "0.0.0.0", end: "255.255.255.255" },
  //       permissions: AccountSASPermissions.parse("rwdlacup").toString(),
  //       protocol: SASProtocol.HTTPSandHTTP,
  //       resourceTypes: AccountSASResourceTypes.parse("co").toString(),
  //       services: AccountSASServices.parse("btqf").toString(),
  //       version: "2016-05-31"
  //     },
  //     sharedKeyCredential as SharedKeyCredential
  //   ).toString();

  //   const sasURL = `${serviceURL.url}?${sas}`;
  //   const serviceURLWithSAS = new ServiceURL(
  //     sasURL,
  //     StorageURL.newPipeline(new AnonymousCredential())
  //   );

  //   const containerName = getUniqueName("con");
  //   const containerURL = ContainerURL.fromServiceURL(
  //     serviceURLWithSAS,
  //     containerName
  //   );
  //   await containerURL.create(Aborter.none);

  //   const tableName1 = getUniqueName("table");
  //   const tableName2 = getUniqueName("table");
  //   const table1 = BlockTableURL.fromContainerURL(containerURL, tableName1);
  //   const table2 = BlockTableURL.fromContainerURL(containerURL, tableName2);

  //   await table1.upload(Aborter.none, "hello", 5);
  //   await table2.startCopyFromURL(Aborter.none, table1.url);

  //   // this copy should not throw any errors
  //   await table2.startCopyFromURL(Aborter.none, table1.url);
  // });

  // it("Copy table shouldn't work without write permission in account SAS to override an existing table @loki", async () => {
  //   const tmr = new Date();
  //   tmr.setDate(tmr.getDate() + 1);

  //   // By default, credential is always the last element of pipeline factories
  //   const factories = serviceURL.pipeline.factories;
  //   const sharedKeyCredential = factories[factories.length - 1];

  //   const sas = generateAccountSASQueryParameters(
  //     {
  //       expiryTime: tmr,
  //       ipRange: { start: "0.0.0.0", end: "255.255.255.255" },
  //       permissions: AccountSASPermissions.parse("rdlacup").toString(),
  //       protocol: SASProtocol.HTTPSandHTTP,
  //       resourceTypes: AccountSASResourceTypes.parse("co").toString(),
  //       services: AccountSASServices.parse("btqf").toString(),
  //       version: "2016-05-31"
  //     },
  //     sharedKeyCredential as SharedKeyCredential
  //   ).toString();

  //   const sasURL = `${serviceURL.url}?${sas}`;
  //   const serviceURLWithSAS = new ServiceURL(
  //     sasURL,
  //     StorageURL.newPipeline(new AnonymousCredential())
  //   );

  //   const containerName = getUniqueName("con");
  //   const containerURL = ContainerURL.fromServiceURL(
  //     serviceURLWithSAS,
  //     containerName
  //   );
  //   await containerURL.create(Aborter.none);

  //   const tableName1 = getUniqueName("table");
  //   const tableName2 = getUniqueName("table");
  //   const table1 = BlockTableURL.fromContainerURL(containerURL, tableName1);
  //   const table2 = BlockTableURL.fromContainerURL(containerURL, tableName2);

  //   await table1.upload(Aborter.none, "hello", 5);
  //   await table2.startCopyFromURL(Aborter.none, table1.url);

  //   // this copy should throw 403 error
  //   let error;
  //   try {
  //     await table2.startCopyFromURL(Aborter.none, table1.url);
  //   } catch (err) {
  //     error = err;
  //   }
  //   assert.deepEqual(error.statusCode, 403);
  //   assert.ok(error !== undefined);
  // });

  // it("Copy table should work without write permission in account SAS to an nonexisting table @loki", async () => {
  //   const tmr = new Date();
  //   tmr.setDate(tmr.getDate() + 1);

  //   // By default, credential is always the last element of pipeline factories
  //   const factories = serviceURL.pipeline.factories;
  //   const sharedKeyCredential = factories[factories.length - 1];

  //   const sas = generateAccountSASQueryParameters(
  //     {
  //       expiryTime: tmr,
  //       ipRange: { start: "0.0.0.0", end: "255.255.255.255" },
  //       permissions: AccountSASPermissions.parse("c").toString(),
  //       protocol: SASProtocol.HTTPSandHTTP,
  //       resourceTypes: AccountSASResourceTypes.parse("co").toString(),
  //       services: AccountSASServices.parse("btqf").toString(),
  //       version: "2016-05-31"
  //     },
  //     sharedKeyCredential as SharedKeyCredential
  //   ).toString();

  //   const sasURL = `${serviceURL.url}?${sas}`;
  //   const serviceURLWithSAS = new ServiceURL(
  //     sasURL,
  //     StorageURL.newPipeline(new AnonymousCredential())
  //   );

  //   const containerName = getUniqueName("con");
  //   const containerURL = ContainerURL.fromServiceURL(
  //     serviceURLWithSAS,
  //     containerName
  //   );
  //   await containerURL.create(Aborter.none);

  //   const tableName1 = getUniqueName("table");
  //   const tableName2 = getUniqueName("table");
  //   const table1 = BlockTableURL.fromContainerURL(containerURL, tableName1);
  //   const table2 = BlockTableURL.fromContainerURL(containerURL, tableName2);

  //   await table1.upload(Aborter.none, "hello", 5);

  //   // this copy should work
  //   await table2.startCopyFromURL(Aborter.none, table1.url);
  // });

  // it("generateTableSASQueryParameters should work for table @loki @sql", async () => {
  //   const now = new Date();
  //   now.setMinutes(now.getMinutes() - 5); // Skip clock skew with server

  //   const tmr = new Date();
  //   tmr.setDate(tmr.getDate() + 1);

  //   // By default, credential is always the last element of pipeline factories
  //   const factories = serviceURL.pipeline.factories;
  //   const sharedKeyCredential = factories[factories.length - 1];

  //   const containerName = getUniqueName("container");
  //   const containerURL = ContainerURL.fromServiceURL(serviceURL, containerName);
  //   await containerURL.create(Aborter.none);

  //   const tableName = getUniqueName("table");
  //   const tableURL = PageTableURL.fromContainerURL(containerURL, tableName);
  //   await tableURL.create(Aborter.none, 1024, {
  //     tableHTTPHeaders: {
  //       tableContentType: "content-type-original"
  //     }
  //   });

  //   const tableSAS = generateTableSASQueryParameters(
  //     {
  //       tableName,
  //       // cacheControl: "cache-control-override",
  //       containerName,
  //       // contentDisposition: "content-disposition-override",
  //       // contentEncoding: "content-encoding-override",
  //       // contentLanguage: "content-language-override",
  //       // contentType: "content-type-override",
  //       expiryTime: tmr,
  //       ipRange: { start: "0.0.0.0", end: "255.255.255.255" },
  //       permissions: TableSASPermissions.parse("racwd").toString(),
  //       protocol: SASProtocol.HTTPSandHTTP,
  //       startTime: now,
  //       version: "2016-05-31"
  //     },
  //     sharedKeyCredential as SharedKeyCredential
  //   );

  //   const sasURL = `${tableURL.url}?${tableSAS}`;
  //   const tableURLwithSAS = new PageTableURL(
  //     sasURL,
  //     StorageURL.newPipeline(new AnonymousCredential())
  //   );

  //   await tableURLwithSAS.getProperties(Aborter.none);

  //   // TODO:
  //   // const properties = await tableURLwithSAS.getProperties(Aborter.none);
  //   // assert.equal(properties.cacheControl, "cache-control-override");
  //   // assert.equal(properties.contentDisposition, "content-disposition-override");
  //   // assert.equal(properties.contentEncoding, "content-encoding-override");
  //   // assert.equal(properties.contentLanguage, "content-language-override");
  //   // assert.equal(properties.contentType, "content-type-override");

  //   await containerURL.delete(Aborter.none);
  // });

  // it("generateTableSASQueryParameters should work for table with special naming @loki @sql", async () => {
  //   const now = new Date();
  //   now.setMinutes(now.getMinutes() - 5); // Skip clock skew with server

  //   const tmr = new Date();
  //   tmr.setDate(tmr.getDate() + 1);

  //   // By default, credential is always the last element of pipeline factories
  //   const factories = serviceURL.pipeline.factories;
  //   const sharedKeyCredential = factories[factories.length - 1];

  //   const containerName = getUniqueName("container-with-dash");
  //   const containerURL = ContainerURL.fromServiceURL(serviceURL, containerName);
  //   await containerURL.create(Aborter.none);

  //   const tableName = getUniqueName(
  //     // tslint:disable-next-line:max-line-length
  //     "////Upper/table/empty /another 汉字 ру́сский язы́к ру́сский язы́к عربي/عربى にっぽんご/にほんご . special ~!@#$%^&*()_+`1234567890-={}|[]\\:\";'<>?,/'"
  //   );
  //   const tableURL = PageTableURL.fromContainerURL(containerURL, tableName);
  //   await tableURL.create(Aborter.none, 1024, {
  //     tableHTTPHeaders: {
  //       tableContentType: "content-type-original"
  //     }
  //   });

  //   const tableSAS = generateTableSASQueryParameters(
  //     {
  //       // NOTICE: Azure Storage Server will replace "\" with "/" in the table names
  //       tableName: tableName.replace(/\\/g, "/"),
  //       // cacheControl: "cache-control-override",
  //       containerName,
  //       // contentDisposition: "content-disposition-override",
  //       // contentEncoding: "content-encoding-override",
  //       // contentLanguage: "content-language-override",
  //       // contentType: "content-type-override",
  //       expiryTime: tmr,
  //       ipRange: { start: "0.0.0.0", end: "255.255.255.255" },
  //       permissions: TableSASPermissions.parse("racwd").toString(),
  //       protocol: SASProtocol.HTTPSandHTTP,
  //       startTime: now,
  //       version: "2016-05-31"
  //     },
  //     sharedKeyCredential as SharedKeyCredential
  //   );

  //   const sasURL = `${tableURL.url}?${tableSAS}`;
  //   const tableURLwithSAS = new PageTableURL(
  //     sasURL,
  //     StorageURL.newPipeline(new AnonymousCredential())
  //   );

  //   await tableURLwithSAS.getProperties(Aborter.none);

  //   // TODO:
  //   // const properties = await tableURLwithSAS.getProperties(Aborter.none);
  //   // assert.equal(properties.cacheControl, "cache-control-override");
  //   // assert.equal(properties.contentDisposition, "content-disposition-override");
  //   // assert.equal(properties.contentEncoding, "content-encoding-override");
  //   // assert.equal(properties.contentLanguage, "content-language-override");
  //   // assert.equal(properties.contentType, "content-type-override");

  //   await containerURL.delete(Aborter.none);
  // });

  // it("generateTableSASQueryParameters should work for table with access policy @loki @sql", async () => {
  //   const now = new Date();
  //   now.setMinutes(now.getMinutes() - 5); // Skip clock skew with server

  //   const tmr = new Date();
  //   tmr.setDate(tmr.getDate() + 1);

  //   // By default, credential is always the last element of pipeline factories
  //   const factories = serviceURL.pipeline.factories;
  //   const sharedKeyCredential = factories[factories.length - 1];

  //   const containerName = getUniqueName("container");
  //   const containerURL = ContainerURL.fromServiceURL(serviceURL, containerName);
  //   await containerURL.create(Aborter.none);

  //   const tableName = getUniqueName("table");
  //   const tableURL = PageTableURL.fromContainerURL(containerURL, tableName);
  //   await tableURL.create(Aborter.none, 1024);

  //   const id = "unique-id";
  //   const result = await containerURL.setAccessPolicy(Aborter.none, undefined, [
  //     {
  //       accessPolicy: {
  //         expiry: tmr,
  //         permission: ContainerSASPermissions.parse("racwdl").toString(),
  //         start: now
  //       },
  //       id
  //     }
  //   ]);
  //   assert.equal(
  //     result._response.request.headers.get("x-ms-client-request-id"),
  //     result.clientRequestId
  //   );

  //   const tableSAS = generateTableSASQueryParameters(
  //     {
  //       containerName,
  //       identifier: id
  //     },
  //     sharedKeyCredential as SharedKeyCredential
  //   );

  //   const sasURL = `${tableURL.url}?${tableSAS}`;
  //   const tableURLwithSAS = new PageTableURL(
  //     sasURL,
  //     StorageURL.newPipeline(new AnonymousCredential())
  //   );

  //   await tableURLwithSAS.getProperties(Aborter.none);
  //   await containerURL.delete(Aborter.none);
  // });

  // it("Copy table should work with write permission in table SAS to override an existing table @loki", async () => {
  //   const now = new Date();
  //   now.setMinutes(now.getMinutes() - 5); // Skip clock skew with server

  //   const tmr = new Date();
  //   tmr.setDate(tmr.getDate() + 1);

  //   // By default, credential is always the last element of pipeline factories
  //   const factories = serviceURL.pipeline.factories;
  //   const sharedKeyCredential = factories[factories.length - 1];

  //   const containerName = getUniqueName("container");
  //   const containerURL = ContainerURL.fromServiceURL(serviceURL, containerName);
  //   await containerURL.create(Aborter.none);

  //   const containerSAS = generateTableSASQueryParameters(
  //     {
  //       containerName,
  //       expiryTime: tmr,
  //       ipRange: { start: "0.0.0.0", end: "255.255.255.255" },
  //       permissions: ContainerSASPermissions.parse("w").toString(),
  //       protocol: SASProtocol.HTTPSandHTTP,
  //       startTime: now,
  //       version: "2016-05-31"
  //     },
  //     sharedKeyCredential as SharedKeyCredential
  //   );

  //   const sasURL = `${containerURL.url}?${containerSAS}`;
  //   const containerURLwithSAS = new ContainerURL(
  //     sasURL,
  //     StorageURL.newPipeline(new AnonymousCredential())
  //   );

  //   const tableName1 = getUniqueName("table");
  //   const tableName2 = getUniqueName("table");
  //   const table1 = BlockTableURL.fromContainerURL(containerURL, tableName1);
  //   const table2 = BlockTableURL.fromContainerURL(containerURL, tableName2);
  //   const table2SAS = BlockTableURL.fromContainerURL(
  //     containerURLwithSAS,
  //     tableName2
  //   );

  //   await table1.upload(Aborter.none, "hello", 5);
  //   await table2.upload(Aborter.none, "world", 5);

  //   // this copy should not throw any errors
  //   await table2SAS.startCopyFromURL(Aborter.none, table1.url);
  // });

  // it("Copy table shouldn't work without write permission in table SAS to override an existing table @loki", async () => {
  //   const now = new Date();
  //   now.setMinutes(now.getMinutes() - 5); // Skip clock skew with server

  //   const tmr = new Date();
  //   tmr.setDate(tmr.getDate() + 1);

  //   // By default, credential is always the last element of pipeline factories
  //   const factories = serviceURL.pipeline.factories;
  //   const sharedKeyCredential = factories[factories.length - 1];

  //   const containerName = getUniqueName("container");
  //   const containerURL = ContainerURL.fromServiceURL(serviceURL, containerName);
  //   await containerURL.create(Aborter.none);

  //   const containerSAS = generateTableSASQueryParameters(
  //     {
  //       containerName,
  //       expiryTime: tmr,
  //       ipRange: { start: "0.0.0.0", end: "255.255.255.255" },
  //       permissions: ContainerSASPermissions.parse("c").toString(),
  //       protocol: SASProtocol.HTTPSandHTTP,
  //       startTime: now,
  //       version: "2016-05-31"
  //     },
  //     sharedKeyCredential as SharedKeyCredential
  //   );

  //   const sasURL = `${containerURL.url}?${containerSAS}`;
  //   const containerURLwithSAS = new ContainerURL(
  //     sasURL,
  //     StorageURL.newPipeline(new AnonymousCredential())
  //   );

  //   const tableName1 = getUniqueName("table");
  //   const tableName2 = getUniqueName("table");
  //   const table1 = BlockTableURL.fromContainerURL(containerURL, tableName1);
  //   const table2 = BlockTableURL.fromContainerURL(containerURL, tableName2);
  //   const table2SAS = BlockTableURL.fromContainerURL(
  //     containerURLwithSAS,
  //     tableName2
  //   );

  //   await table1.upload(Aborter.none, "hello", 5);
  //   await table2.upload(Aborter.none, "world", 5);

  //   // this copy should throw 403 error
  //   let error;
  //   try {
  //     await table2SAS.startCopyFromURL(Aborter.none, table1.url);
  //   } catch (err) {
  //     error = err;
  //   }
  //   assert.deepEqual(error.statusCode, 403);
  //   assert.ok(error !== undefined);
  // });

  // it("Copy table should work without write permission in account SAS to an nonexisting table @loki", async () => {
  //   const now = new Date();
  //   now.setMinutes(now.getMinutes() - 5); // Skip clock skew with server

  //   const tmr = new Date();
  //   tmr.setDate(tmr.getDate() + 1);

  //   // By default, credential is always the last element of pipeline factories
  //   const factories = serviceURL.pipeline.factories;
  //   const sharedKeyCredential = factories[factories.length - 1];

  //   const containerName = getUniqueName("container");
  //   const containerURL = ContainerURL.fromServiceURL(serviceURL, containerName);
  //   await containerURL.create(Aborter.none);

  //   const containerSAS = generateTableSASQueryParameters(
  //     {
  //       containerName,
  //       expiryTime: tmr,
  //       ipRange: { start: "0.0.0.0", end: "255.255.255.255" },
  //       permissions: ContainerSASPermissions.parse("c").toString(),
  //       protocol: SASProtocol.HTTPSandHTTP,
  //       startTime: now,
  //       version: "2016-05-31"
  //     },
  //     sharedKeyCredential as SharedKeyCredential
  //   );

  //   const sasURL = `${containerURL.url}?${containerSAS}`;
  //   const containerURLwithSAS = new ContainerURL(
  //     sasURL,
  //     StorageURL.newPipeline(new AnonymousCredential())
  //   );

  //   const tableName1 = getUniqueName("table");
  //   const tableName2 = getUniqueName("table");
  //   const table1 = BlockTableURL.fromContainerURL(containerURL, tableName1);
  //   const table2SAS = BlockTableURL.fromContainerURL(
  //     containerURLwithSAS,
  //     tableName2
  //   );

  //   await table1.upload(Aborter.none, "hello", 5);

  //   // this copy should work
  //   await table2SAS.startCopyFromURL(Aborter.none, table1.url);
  // });

  // it("GenerateUserDelegationSAS should work for table snapshot @loki @sql", async () => {
  //   const now = new Date();
  //   now.setMinutes(now.getMinutes() - 5); // Skip clock skew with server

  //   const tmr = new Date();
  //   tmr.setDate(tmr.getDate() + 1);

  //   // By default, credential is always the last element of pipeline factories
  //   const factories = serviceURL.pipeline.factories;
  //   const sharedKeyCredential = factories[factories.length - 1];

  //   const containerName = getUniqueName("container");
  //   const containerURL = ContainerURL.fromServiceURL(serviceURL, containerName);
  //   await containerURL.create(Aborter.none);

  //   const tableName = getUniqueName("table");
  //   const tableURL = PageTableURL.fromContainerURL(containerURL, tableName);
  //   await tableURL.create(Aborter.none, 1024, {
  //     tableHTTPHeaders: {
  //       tableContentType: "content-type-original"
  //     }
  //   });
  //   const response = await tableURL.createSnapshot(Aborter.none);

  //   const tableSAS = generateTableSASQueryParameters(
  //     {
  //       tableName,
  //       // cacheControl: "cache-control-override",
  //       containerName,
  //       // contentDisposition: "content-disposition-override",
  //       // contentEncoding: "content-encoding-override",
  //       // contentLanguage: "content-language-override",
  //       // contentType: "content-type-override",
  //       expiryTime: tmr,
  //       ipRange: { start: "0.0.0.0", end: "255.255.255.255" },
  //       permissions: TableSASPermissions.parse("racwd").toString(),
  //       protocol: SASProtocol.HTTPSandHTTP,
  //       startTime: now,
  //       snapshotTime: response.snapshot
  //     },
  //     sharedKeyCredential as SharedKeyCredential
  //   );

  //   const sasURL = `${
  //     tableURL.withSnapshot(response.snapshot!).url
  //   }&${tableSAS}`;
  //   const tableURLwithSAS = new PageTableURL(
  //     sasURL,
  //     StorageURL.newPipeline(new AnonymousCredential())
  //   );

  //   const properties = await tableURLwithSAS.getProperties(Aborter.none);
  //   assert.ok(properties);
  //   // assert.equal(properties.cacheControl, "cache-control-override");
  //   // assert.equal(properties.contentDisposition, "content-disposition-override");
  //   // assert.equal(properties.contentEncoding, "content-encoding-override");
  //   // assert.equal(properties.contentLanguage, "content-language-override");
  //   // assert.equal(properties.contentType, "content-type-override");

  //   await containerURL.delete(Aborter.none);
  // });
});
