import { FieldAuthorizeResolver } from 'nexus/dist/plugins/fieldAuthorizePlugin'
declare global {
    interface NexusGenPluginFieldConfig<TypeName extends string, FieldName extends string> {
        /**
         * Authorization for an individual field. Returning "true"
         * or "Promise<true>" means the field can be accessed.
         * Returning "false" or "Promise<false>" will respond
         * with a "Not Authorized" error for the field.
         * Returning or throwing an error will also prevent the
         * resolver from executing.
         */
        authorize?: FieldAuthorizeResolver<TypeName, FieldName>
    }
}