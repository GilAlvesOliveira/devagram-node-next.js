import type { NextApiRequest, NextApiResponse } from "next";
import type {RespostaPadraoMsg} from '../../types/RespostaPadraoMsg';
import type {CadastroRequisicao} from '../../types/CadastroRequisicao';
import { UsuarioModel } from '../../models/UsuarioModels';
import md5 from "md5";
import {conectarMongoDB} from '../../middlewares/conectarMongoDB';
import {upload, uploadImagemCosmic} from '../../services/uploadImagemCosmic';
import nc from 'next-connect';
import {politicaCORS} from '../../middlewares/politicaCORS';

const handler = nc()
    .use(upload.single('file'))
    .post(async (req: NextApiRequest, res: NextApiResponse<RespostaPadraoMsg>) => {

            const usuario = req.body as CadastroRequisicao;
    
            if(!usuario.nome || usuario.nome.length < 3){
                return res.status(400).json({erro : 'Nome invalido'});
            }
    
            if(!usuario.email || usuario.email.length < 6 
                || !usuario.email.includes('@')
                || !usuario.email.includes('.')){
                    return res.status(400).json({erro : 'Email invalido'});
                }
    
                if(!usuario.senha || usuario.senha.length < 6){
                    return res.status(400).json({erro : 'Senha invalida'});
                }
                
                //validacao se ja exixte usuario com mesmo email
                const usuariosComMesmoEmail = await UsuarioModel.find({email : usuario.email});
                if(usuariosComMesmoEmail && usuariosComMesmoEmail.length > 0){
                    return res.status(400).json({erro : 'Ja existe uma conta com o email informado'})
                }
                //enviar a imagem do multer para o comic 
                const image = await uploadImagemCosmic(req);

                //salvar no banco de dados
                const usuarioASerSalvo = {
                    nome : usuario.nome,
                    email : usuario.email,
                    senha : md5(usuario.senha),
                    avatar : image?.media?.url
                }
                await UsuarioModel.create(usuarioASerSalvo);
            return res.status(200).json({msg : 'Usuario criado com sucesso'});
    });

    export const config = {
        api: {
            bodyParser : false
        }
    }
            
export default politicaCORS(conectarMongoDB(handler));