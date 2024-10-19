const path = require('path');

module.exports = {
  target: 'node',  // Configura o Webpack para compilar código para o Node.js
  entry: './index.js',  // O arquivo de entrada para o seu back-end (ajuste conforme necessário)
  output: {
    filename: 'bundle.js',  // Nome do arquivo compilado
    path: path.resolve(__dirname, 'dist')  // A saída será na pasta 'dist'
  },
  mode: 'production',  // Use 'development' para testes, ou 'production' para produção
  module: {
    rules: [
      {
        test: /\.js$/,  // Aplica as regras a todos os arquivos .js
        exclude: /node_modules/,  // Não processa arquivos da pasta node_modules
        use: {
          loader: 'babel-loader',  // Usa Babel para transpilação
          options: {
            presets: ['@babel/preset-env']  // Transpila para uma versão de JS compatível com Node.js
          }
        }
      }
    ]
  },
  node: {
    __dirname: false,  // Mantém o valor correto de __dirname
    __filename: false  // Mantém o valor correto de __filename
  }
};
