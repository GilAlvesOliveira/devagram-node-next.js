import type {NextApiRequest, NextApiResponse} from 'next';
import type {RespostaPadraoMsg} from '../../types/RespostaPadraoMsg';
import { conectarMongoDB } from '@/middlewares/conectarMongoDB';
import { validarTokenJWT } from '@/middlewares/validarTokenJWT';
import { UsuarioModel } from '@/models/UsuarioModels';

const pesquisaEndpoint = async (req : NextApiRequest, res : NextApiResponse<RespostaPadraoMsg | any[]>) => {

    try{
        if(req.method === 'GET'){

            const {filtro} = req.query;
            if(!filtro || filtro.length < 2){
                return res.status(400).json({erro : 'Favor informar pelo menos 2 caracteres para a busca'});
            }

            const usuariosEncontrados = await UsuarioModel.find({
                nome : {$regex : filtro, $options: 'i'}
            });

            return res.status(200).json(usuariosEncontrados);
        }
        return res.status(405).json({erro : 'Metodo informado nao e valido'});
    }catch(e){
        console.log(e);
        return res.status(500).json({erro : 'Nao foi possivel biscar usuario' + e})
    }
}

export default validarTokenJWT(conectarMongoDB(pesquisaEndpoint));