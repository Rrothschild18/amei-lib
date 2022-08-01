---

@Romulo @Lincoln Queria saber a opiniao de voces sobre a arquitetura do front-end.
Como eu comentei, a lib que eu trabalhei Asteroid tem uma solucao bem massa para CRUDs. Basicamente ela tem 3 componentes principais: ListView, SingleView e FormView.

Esses componentes sao containers os quais ficam responsaveis por tratar a resource no backend e disponibilizar alguns slots passando resource de contexto.

Existem algumas abstracoes mais complexas, como por exemplo deixar somente as requisicoes atraves da Store(Vuex), armazenar, e depoi servir os componentes.

De qualquer forma, a ideia eh deixar assim a responsabilidade de exibir os dados somente para os compoentes stateless (Tabelas, Cards, Lists etc).

Vou estar disponibilizando o stackblitz para ficar do que eu consegui fazer. Mas para isso precisava ser decidido alguns pontos:

o backend vai ser em portugues ou em ingles?
Tem como trazar em conjunto os campos da entidade do banco junto com as resposta do backend?
