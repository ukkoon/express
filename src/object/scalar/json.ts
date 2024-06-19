import { scalarType } from "nexus";

export const Json = scalarType({
    name: "Json",
    asNexusMethod: "json",
})
