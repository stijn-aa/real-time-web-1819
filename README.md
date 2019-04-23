# Realtime web
## Chatapp week 1
[Chatapp-stijn.herokuapp.com](Chatapp-stijn.herokuapp.com)

Als chat app heb ik mij gefocust op 2 dingen. De basics van socket.io en begrijpen hoe ik met de google-assistent kan werken. 
Om dit de doen ben ik begonnen met de socket io chat app tutorial. Ik heb zelf nog leeftijd in de vorm van minuten sinds de login toe gevoegd en een username die je kunt aangeven en veranderen. 
Met de google-assistent ben ik begonnen tijdens webdesign. Om te kijken of je via de spraakinterface een website kon besturen of een formulier kon invullen. Ik ben begonnen bij diagramflow. Hier kun je zinnen maken met variabelen in de zin. Dit kun je vervolgens zeggen tegen de google-assistent om ze in te vullen. Al vrij snel had ik een aanvraag ontvangen in mijn node server door een webhook op te geven. Met de actions on google module kan je dan de aanvraag verwerken en zelf een antwoord genereren. 
De volgende dingen kun je doen met de google-assistent
Je naam opgeven of veranderen,
Een bericht in de chat zetten,
De achtergrond kleur van de chat veranderen,

## week 2
Concept: Een dating chat app om mensen die last hebben van de zelfde storing met elkaar te laten praten. Met de ns api zijn worden de storingen opgehaald en kun je een match uitzoeken. Je kunt met 1 iemand matchen en op een match verzoek reageren per storing. Zo worden de gebruikers geforceert om het gesprek gaande te houden en niet te snel een nieuwe match te zoeken.

#### Ns api documentatie:
met de ns api is het mogelijk om reisplanner infomatie op te vragen zoals;

- Actuele vertrektijden

- Storingen en werkzaamheden

- De stationslijst met alle stations in Nederland inclusief Geodata

- Reisadviezen van station naar station

Met een account krijg je toegang door een api key en die geeft je toegang tot de data.
Er is een rate limit maar er staat nergens hoeveel. Dit heb ik op gevraagd via de support mail.

request: GET https://gateway.apiportal.ns.nl/public-reisinformatie/api/v2/disruptions?type=storing&lang=nl

### live cycle data V1
![live cycle data](https://i.gyazo.com/ac0124298db8c193e3f800c879bac416.png)

toelichting:
- De server pollt elke 30 sec de api. Deze geeft een storing array terug.

- Als client verbind je met de socket. Hier maak je een profiel aan (tot nu toe alleen een naam).

- De client kiest een storing. Dit is tevents het room id die hij dan joint

- De server geeft update alle clients in deze room met een nieuwe set aan users

- Een user kan iemand uit de room keizen om mee te chatten. deze user krijgt een update in de vorm van een match request

- als de user deze accepteert kunnen de users chat berichten naar elkaar versturen.

# status
### should have

- Basic matching system .Done
- Remove user when disconected
- make simple profile with name, age, bio 
- chatroom with match
- visual feedback > matching status: send/matched

### would like to have

- nicer css
- unmatch feature
- able to chat with more than one person at ones
- 









