import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import * as uuid from "uuid";
import { generateResultPagination } from "@qbit-tech/libs-utils";
import { RoleCreateRequest, RoleFindAllResponse } from "./role.contract";
import { RoleModel, RoleProperties } from "./role.entity";
import { Op } from "sequelize";

@Injectable()
export class RoleService {
  constructor(
    @InjectModel(RoleModel)
    private readonly roleRepositories: typeof RoleModel
  ) {}

  async findAll(params: { search?: string; isActive?: string; offset?: number; limit?: number }): Promise<{
    count: number;
    prev: string;
    next: string;
    results: RoleProperties[];
  }> {
    try {
      Logger.log("--ENTER FIND ALL, ROLE SERVICE--");
      console.info("params", params);

      const options: any = {
        where: {},
        distinct: true,
        col: "roleId",
      };

      params.search &&
        (options.where = {
          ...options.where,
          [Op.or]: [{ roleName: { [Op.iLike]: `%${params.search}%` } }],
        });

      if (params.hasOwnProperty("isActive") && typeof params.isActive === "string") {
        options.where = {
          ...options.where,
          isActive: params.isActive,
        };
      }

      const count = await this.roleRepositories.count({ ...options });
      const results = await this.roleRepositories.findAll({
        ...options,
        limit: params.limit,
        offset: params.offset,
        order: [["createdAt", "DESC"]],
      });

      Logger.log("file found: " + JSON.stringify(results), "role.service");

      return {
        ...generateResultPagination(count, params),
        results: results.map((row) => row.get()),
      };
    } catch (error) {
      Logger.error("findAll role::: error: " + JSON.stringify(error), "role.service", "role.service");
      return Promise.reject(error);
    }
  }

  async findOne(roleId: string): Promise<RoleProperties> {
    try {
      Logger.log("--ENTER FIND ONE, ROLE SERVICE--");
      const result = await this.roleRepositories.findOne({
        where: { roleId },
      });

      Logger.log("file found: " + JSON.stringify(result), "role.service");

      return result ? result.get() : null;
    } catch (error) {
      Logger.error("findOne role::: error: " + JSON.stringify(error), "role.service", "role.service");
      return Promise.reject(error);
    }
  }

  async create(params: RoleCreateRequest): Promise<RoleProperties> {
    try {
      Logger.log("--ENTER CREATE, ROLE SERVICE--");

      const result = await this.roleRepositories.create({
        // roleId: uuidv4(),
        roleId: uuid.v4(),
        roleName: params.roleName,
        roleDescription: params.roleDescription,
        isActive: params.isActive,
        isDeleted: false,
        permissions: params.permissions,
      });

      Logger.log("file created: " + JSON.stringify(result), "role.service");

      return this.findOne(result.roleId);
    } catch (error) {
      Logger.error("create role::: error: " + JSON.stringify(error), "role.service", "role.service");
      return Promise.reject(error);
    }
  }

  async update(params: Omit<RoleProperties, "createdAt" | "updatedAt">): Promise<RoleProperties> {
    try {
      Logger.log("--ENTER UPDATE, ROLE SERVICE--");
      const data: any = {
        roleName: params.roleName,
        roleDescription: params.roleDescription,
        isActive: params.isActive,
        isDeleted: params.isDeleted,
        permissions: params.permissions,
      };
      const result = await this.roleRepositories.update(data, {
        where: {
          roleId: params.roleId,
        },
        returning: true,
      });

      Logger.log("file updated: " + JSON.stringify(result), "contentArticle.service");

      const roleResult = await this.findOne(params.roleId);

      return await this.findOne(roleResult.roleId);
    } catch (error) {
      Logger.error("update role::: error: " + JSON.stringify(error), "role.service", "role.service");
      return Promise.reject(error);
    }
  }

  async delete(roleId: string): Promise<{ isSuccess: true }> {
    try {
      Logger.log("--ENTER DELETE, ROLE SERVICE--");
      const result = await this.roleRepositories.destroy({
        where: { roleId },
      });

      Logger.log("file deleted: " + JSON.stringify(result), "role.service");

      return { isSuccess: true };
    } catch (error) {
      Logger.error("delete role::: error: " + JSON.stringify(error), "role.service", "role.service");
      return Promise.reject(error);
    }
  }

  async convert(data: RoleFindAllResponse): Promise<RoleFindAllResponse>{
    try{
      let versionType: string;
      let newPermissions: any;
      const converted = data.results.forEach(item => {
        if(typeof item.permissions !== 'object' || item.permissions === null || Array.isArray(item.permissions)){
          versionType = "Unknown";
        }

        const keys = Object.keys(item.permissions);
        if (keys.length === 0){
          versionType = "Unknown";
        }

        const firstKey = keys[0];
        const firstValue = item.permissions[firstKey];

        if (typeof firstValue === "object" && firstValue !== null &&
            "__type" in firstValue && "__title" in firstValue) {
            versionType = "v1";
            const groupedResult = {} as {[key: string]: string[]};
            Object.keys(item.permissions).forEach((objectName: string) => {
              const objectData = item.permissions[objectName] as { [key: string]: { value: boolean; __type: string; __title: string } };
              const newKeys = Object.keys(objectData)
                .filter((key) => objectData[key].value == true)
                .map((key) => key.toUpperCase());
              groupedResult[objectName] = newKeys;
              newPermissions = groupedResult;
            })
            Logger.log(item.roleName + " " + JSON.stringify(groupedResult));
            this.update({ 
              roleId:item.roleId, 
              roleName:item.roleName, 
              roleDescription:item.roleDescription,
              isActive:true,
              isDeleted:false,
              permissions:newPermissions
            })
        } else if (Array.isArray(firstValue) && firstValue.every((item: any) => typeof item === "string")) {
            Logger.log("Permissions for " + item.roleName + " are already version 2.")
        } else {
            versionType = "Unknown";
        }
        Logger.log(item.roleName + " " + versionType);

      });
      Logger.log(JSON.stringify(converted));
    } catch (error) {
    }
    return this.findAll({});
  }
}
