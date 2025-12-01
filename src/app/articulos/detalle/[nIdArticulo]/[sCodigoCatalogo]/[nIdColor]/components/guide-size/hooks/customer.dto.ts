import { Profile } from "@/lib/interfaces/profile";

export class CustomerDTO {
  constructor(
    public external_id: string,
    public num_doc: string,
    public first_name: string,
    public last_name: string,
    public email: string,
    public phone: string,
    public type_customer: string
  ) {}

  static fromProfile(profile: Profile | null): CustomerDTO | null {
    if (!profile) {
      return null;
    }

    return new CustomerDTO(
      profile.cliente.nIdCliente.toString(),
      profile.cliente.infoCliente.documento.sNumeroDocumento,
      profile.cliente.infoCliente.sNombre,
      profile.cliente.infoCliente.sApellidos,
      profile.cliente.infoCliente.contactoCliente.sEmail || "",
      profile.cliente.infoCliente.contactoCliente.sTelefono || "",
      profile.usuario.rol.sNombre
    );
  }
}
