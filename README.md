# Gestión de Pedidos para Emprendimientos
Software de Gestión de negocio para emprendimientos que funcionan en base a pedidos o encargos y productos, particularizado para Willow (Emprendimiento de marroquinería infantil y urbana).

![Presentacion](https://github.com/BorisAsen/Gestion-de-Pedidos-para-Emprendimientos/assets/48571306/70f5d74c-6a17-4603-a1a2-906f2e09af96)

La entidad principal sobre la que se desarrolla el sistema son los pedidos, cuya estructura está conformada por uno o más productos, un cliente, tipo de despacho, dirección de entrega, método de pago, costo total del pedido más el envío, fecha y hora de entrega, si está realizado o no, orden de prioridad y demás especificaciones generales.

Se compone de 5 secciones principales: Pedidos, Ventas, Productos, Recaudación y Estadísticas y Usuario.
- __Pedidos__: Página principal. Despliega un listado de tarjetas que se mostrarán según un orden de prioridad dictado por la fecha de entrega de las mismas. Permite filtrar los pedidos del Mes, Semana, Hoy o Mañana, así como también da acceso al historial completo de pedidos en el caso de que alguno no se encuentre entre esas distinciones temporales.
- __Ventas__: Aquí se encuentran los pedidos que ya fueron completados, también filtrados por Mes, Semana, Hoy y con su correspondiente historial de ventas completo.
- __Productos__: Contiene un listado de los productos o servicios que brinda el cliente con la posibilidad de ordenarlos por fecha de creación, costo o bien buscar uno en específico.
- __Recaudación y Estadísticas__: A través de la información recolectada mediante los datos de las ventas realizadas en un período determinado, se muestra tanto la recaudación total como la recaudación neta del emprendimiento, cuántas ventas se realizaron, los productos más vendidos y sus cantidades, etc.
- __Usuario__: En esta sección se encuentran los datos correspondientes al usuario logueado en el sistema, sus configuraciones personalizadas, notificaciones pertinentes a él, etc.

El sistema se pensó y desarrolló en base a las necesidades específicas del emprendimiento con el fin de ser escalable en funcionalidades y características que vayan surgiendo con la expansión del negocio en su rubro.
Algunas próximas a implementar son:
- Logueo mediante cuenta de Google y gestión de permisos de usuario.
- Calculadora de costo de producto.
- Sección Gastos para contabilizar las salidas de dinero.
