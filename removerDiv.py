from bs4 import BeautifulSoup

# Carregar o conteúdo do arquivo HTML
with open('./editar.html', 'r', encoding='utf-8') as file:
    content = file.read()

# Parsear o HTML
soup = BeautifulSoup(content, 'html.parser')

# Encontrar todas as divs com a classe 'roulette-tile' e substituí-las por seus filhos
for div in soup.find_all('div', class_='roulette-tile'):
    div.unwrap()

# Remover todos os atributos style dos elementos
for tag in soup.find_all(style=True):
    del tag['style']

# Substituir todas as tags <svg> por <img> com os atributos especificados
for svg in soup.find_all('svg'):
    img = soup.new_tag('img')
    img['alt'] = 'logo-win'
    img['src'] = 'img/logo-wrapper-white.png'
    svg.replace_with(img)

# Salvar o conteúdo modificado de volta no arquivo HTML
with open('seu_arquivo.html', 'w', encoding='utf-8') as file:
    file.write(str(soup))

print("Divs com a classe 'roulette-tile' removidas mantendo seus filhos, atributos style eliminados e tags SVG substituídas por IMG com sucesso.")
