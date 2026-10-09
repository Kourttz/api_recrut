import { DataSource } from "typeorm";
import { Unidades } from "../modules/unidades/unidades.entity";
import { Usuarios } from "../modules/usuarios/usuarios.entity";

export async function seedUnidades(dataSource: DataSource) {

  const unidadesRepo = dataSource.getRepository(Unidades);
  const usuariosRepo = dataSource.getRepository(Usuarios);

  const total = await unidadesRepo.count();
  if (total > 0) {
    console.log("Seed Unidades ignorado: registros já existem.");
    return;
  }

  // 🔎 Usuário gerente (primeiro ativo)
  const gerente = await usuariosRepo.findOne({
    where: { icSituacaoAtivo: true },
  });

  if (!gerente) {
    throw new Error("Nenhum usuário ativo encontrado para ser gerente.");
  }

  const unidades: Partial<Unidades>[] = [
    {
      nuFilial: 721,
      noProjeto: "Projeto Call Center",
      nuContrato: "CTR-2025-001",
      dtInicio: new Date("2025-01-01"),
      dtFim: undefined,
      nuCnpj: "12345678000199",
      noRazaoSocial: "Empresa Call Center LTDA",
      noEndereco: "Rua das Flores, 123",
      noMunicipio: "São Paulo",
      noUnidadeFederativa: "SP",
      coUsuarioGerente: gerente.coUsuario,
      icSituacaoAtivo: true,
    },
    {
      nuFilial: 722,
      noProjeto: "Projeto Backoffice",
      nuContrato: "CTR-2025-002",
      dtInicio: new Date("2025-02-01"),
      dtFim: undefined,
      nuCnpj: "98765432000188",
      noRazaoSocial: "Empresa Backoffice LTDA",
      noEndereco: "Av. Paulista, 1000",
      noMunicipio: "São Paulo",
      noUnidadeFederativa: "SP",
      coUsuarioGerente: gerente.coUsuario,
      icSituacaoAtivo: true,
    },
  ];

  await unidadesRepo.save(unidades);

  console.log(`Seed Unidades executado com sucesso (${unidades.length} registros).`);
}
