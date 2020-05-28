import React, {Component} from 'react';
import {storeProducts, detailProduct} from "./data";

/*
Il contesto fornisce un modo per far passare i dati attraverso i vari componenti senza dover
passare manualmente la props (l'oggetto come parametro) ad ogni livello.
In una tipica applicazione React, i dati vengono passati dall'alto verso il basso (da padre a figlio)
tramite props, ma ciò può essere ingombrante per alcune props (ad es. Preferenza locale,
tema dell'interfaccia utente) richiesti da molti componenti all'interno di un'applicazione.
Il contesto fornisce un modo per condividere valori come questi tra i componenti senza dover passare esplicitamente
una prop attraverso ogni livello della struttura.
Il contesto è progettato per condividere informazioni che possono essere considerate "global" per i componenti di
un progetto REACT, come l'utente corrente autenticato, il tema o la lingua preferita.
 */

/*
L'idea è quella di mettere nel contesto tutta la lista dei prodotti, in modo da averla sempre a disposizione
in qualsiasi pagina noi ci troviamo.
 */

/*
Crea un oggetto Context.
Quando React esegue il rendering di un componente che sottoscrive a questo oggetto Context,
leggerà il valore di contesto corrente dal matching del Provider più vicino situato sopra di esso nell'albero.
L'argomento defaultValue viene utilizzato solo quando un componente non ha un provider corrispondente sopra di esso
nella struttura.
 */
const ProductContext = React.createContext();

/*
PROVIDER
<MyContext.Provider value={someValue}>
Ogni oggetto Context viene fornito con un componente React di nome Provider che consente ai consumer
di sottoscriversi ai cambiamenti del contesto.
Accetta un value come prop per essere passato ai componenti consumatori che sono discendenti di questo provider.
Un provider può essere collegato a molti consumer.
 */

/*
CONSUMER
<MyContext.Consumer>
  {value =>  render something based on the context value }
</MyContext.Consumer>
Un componente React che si sottoscrive ai cambiamenti del contesto.
Richiede una funzione child. La funzione riceve il valore di contesto corrente e restituisce un nodo React.
L'argomento passato alla funzione sarà uguale al value prop del Provider più vicino per questo contesto situato sopra
nella struttura. Se non esiste un provider per questo contesto, il value prop sarà uguale al
defaultValue passato in createContext().
 */

class ProductProvider extends Component {
    state={
        //products:storeProducts,
        //togliamo la reference a storeProducts
        products:[],
        detailProduct:detailProduct,
        cart: [],
        modalOpen:false,
        modalProduct:detailProduct,
        cartSubtotal:0,
        cartTax:0,
        cartTotal: 0
    };

    /*
    componentDidMount() è invocato dopo che il componente è montato (cioè inserito nell’albero del DOM).
    Le logiche di inizializzazione che dipendono dai nodi del DOM dovrebbero essere dichiarate in questo metodo.
    Inoltre, se hai bisogno di caricare dei dati chiamando un endpoint remoto, questo è un buon punto per istanziare
    la chiamata.
     */
    componentDidMount() {
        this.setProducts();
    };

    /*
    funzione che copia tutti gli elementi dell'array di storeProducts in products
     */
    setProducts = () => {
      let tempProducts = [];
      storeProducts.forEach(item => {
          const singleItem = {...item};
          tempProducts = [...tempProducts, singleItem];
      });
        this.setState(() => {
            return {products:tempProducts}
        })
    };

    getItem = (id) => {
      const product = this.state.products.find(item => item.id === id);
      return product;
    };

    handleDetail = id => {
        const product = this.getItem(id);
        this.setState(() => {
            return {detailProduct:product}
        })
    };

    addToCart = id => {
        //console.log("hello from add to cart " +id);
        let tempProducts = [...this.state.products];
        const index = tempProducts.indexOf(this.getItem(id));
        const product = tempProducts[index];
        product.inCart = true;
        product.count = 1;
        const price = product.price;
        product.total = price;
        this.setState(() => {
            return {products:tempProducts, cart:[...this.state.cart, product]};
        }, () => {this.addTotals()})
    };

    openModal = id => {
        const product = this.getItem(id);
        this.setState(() => {
            return {modalProduct:product, modalOpen: true}
        })
    };

    closeModal = () => {
        this.setState(() => {
            return {modalOpen:false}
        })
    };

    increment = (id) => {
        console.log("Increment method");
        let tempCart = [...this.state.cart];
        const selectedProduct = tempCart.find(item => item.id === id)
        const index = tempCart.indexOf(selectedProduct);
        const product = tempCart[index];
        product.count = product.count + 1;
        product.total = product.price * product.count;
        this.setState(() => {
            return {
                cart:[...tempCart]
            }
        }, () => {
            this.addTotals();
        })
    };

    decrement = (id) => {
        console.log("decrement method");
        let tempCart = [...this.state.cart];
        const selectedProduct = tempCart.find(item => item.id === id);
        const index = tempCart.indexOf(selectedProduct);
        const product = tempCart[index];
        product.count = product.count - 1;
        if (product.count <= 0) {
            this.removeItem(id)
        }
        else {
            product.total = product.price * product.count;
            this.setState(() => {
                return {
                    cart:[...tempCart]
                }
            }, () => {
                this.addTotals();
            })
        }
    };

    removeItem = (id) => {
      console.log("remove item " +id);
      let tempProducts = [...this.state.products];
      let tempCart = [...this.state.cart];

      tempCart = tempCart.filter(item => item.id !== id);
      const index = tempProducts.indexOf(this.getItem(id));
      let removedProduct = tempProducts[index];
      removedProduct.inCart = false;
      removedProduct.count = 0;
      removedProduct.total = 0;

      this.setState(() => {
          return {
              cart: [...tempCart],
              products: [...tempProducts]
          }
      }, () => {
          this.addTotals();
      })
    };

    clearCart = () => {
      console.log("cart was cleared");
      this.setState(() => {
          return {
              cart: []
          }
      }, () => {
          this.setProducts();
          this.addTotals();
      })
    };

    addTotals = () => {
      let subTotal = 0;
      this.state.cart.map(item => (subTotal += item.total));
      const tempTax = subTotal * 0.1;
      const tax = parseFloat(tempTax.toFixed(2));
      const total = subTotal + tax;
      this.setState(() => {
          return {
              cartSubtotal: subTotal,
              cartTax: tax,
              cartTotal: total
          }
      })
    };

    /*
    Con questa funzione notiamo una cosa molto importante...
    Verifichiamo che una volta messo un prodotto nel carrello esso sia effettivamente messo nel carrello.
    Però nello stesso tempo anche il prodotto contenuto nell'array di partenza storeProducts presenta
    inCart = true
    Questo vuol dire che this.state.products punta il suo riferimento sempe all'array iniziale storeProducts
    e quindi qualsiasi cambiamento effettuato nell'array products verrà rimandato anche in storeProducts.
     */
    tester = () => {
        console.log("State products: ", this.state.products[0].inCart);
        console.log("Data products: ", storeProducts[0].inCart);

        const tempProducts = [...this.state.products];
        tempProducts[0].inCart = true;
        this.setState(() => {
            return {products:tempProducts}
        }, () => {
            console.log("State products: ", this.state.products[0].inCart);
            console.log("Data products: ", storeProducts[0].inCart);
        })
    };

    render() {
        return (
            <ProductContext.Provider value={{
                ...this.state,
                handleDetail: this.handleDetail,
                addToCart: this.addToCart,
                openModal: this.openModal,
                closeModal: this.closeModal,
                increment: this.increment,
                decrement: this.decrement,
                removeItem: this.removeItem,
                clearCart: this.clearCart
            }}>
                {/*
                Pulsante per testare il reference dell'array products e storeProducts
                <button onClick={this.tester}>test me</button>
                */}
                {this.props.children}
            </ProductContext.Provider>

            /*
            <ProductContext.Provider value={"hello from phone app"}>
                {this.props.children}
            </ProductContext.Provider>

             */
        );
    }
}

const ProductConsumer = ProductContext.Consumer;

export {ProductProvider, ProductConsumer};