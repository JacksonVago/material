import { setLocale } from "yup";

setLocale({
    mixed:{
        default: "Campo inválido.",
        required: "Campo obrigatório."
    },
    string:{
        email: () => 'O campo precisa conter um email válido.',
        max: ({max}) => `O Campo pode ter no máximo ${max} caracteres.`,
        min: ({min}) => `O Campo precisa ter no mínimo ${min} caracteres.`,
        length: ({length}) => `O Campo precisa ter extamente ${length} caracteres.`
    },
    date:{
        max: ({max}) => `A data deve ser menor que ${max}.`,
        min: ({min}) => `A data deve ser maior que ${min}.`,
    },
    number:{
        integer: () => 'O campo precisa ter um valor inteiro.',
        negative: () => 'O campo precisa ter um valor negativo.',
        positive: () => 'O campo precisa ter um valor positivo.',
        moreThan: ({more}) => `O campo precisa ter um valor maior que ${more}.`,
        lessThan: ({less}) => `O campo precisa ter um valor menor que ${less}.`,
        max: ({max}) => `O Campo precisa ter um valor com mais de ${max} caracteres.`,
        min: ({min}) => `O Campo precisa ter um valor com menos de ${min} caracteres.`,
    },
    boolean:{},
    array:{},
    object:{},
});