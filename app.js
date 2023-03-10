const vm = new Vue({
    el: "#app",
    data: {
        products: [],
        dateProduct: false,
        carrinho: [],
        carrinhoAtivo: false,
        alertMessage: "",
        alertActive: false
    },
    filters: {
        numberPrice(valor) {
            return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
        }
    },
    computed: {
        carrinhoTotal() {
            let total = 0
            if (this.carrinho.length) {
                this.carrinho.forEach(item => {
                    total += item.preco
                })
            }
            return total
        }
    },
    methods: {
        fetProducts() {
            fetch("./api/produtos.json")
                .then(res => res.json())
                .then(res => {
                    this.products = res
                })
        },
        fetProduct(id) {
            fetch(`./api/produtos/${id}/dados.json`)
                .then(res => res.json())
                .then(res => {
                    this.dateProduct = res
                })
        },
        openModal(id) {
            this.fetProduct(id)
            window.scrollTo({ top: 0, behavior: "smooth" })
        },
        closeModal(event) {
            if (event.target === event.currentTarget) {
                this.dateProduct = false
            }
        },
        clickForaCarrinho(event) {
            if (event.target === event.currentTarget) {
                this.carrinhoAtivo = false
            }
        },
        addItem() {
            this.dateProduct.estoque--;
            const { id, nome, preco } = this.dateProduct
            this.carrinho.push({ id, nome, preco })
            this.alert(`${nome} adicionado ao carrinho`)
        },
        removeItem(index) {
            this.carrinho.splice(index, 1)
        },
        checkLocalStorage() {
            if (window.localStorage.carrinho) {
                this.carrinho = JSON.parse(window.localStorage.carrinho)
            }
        },
        compararEstoque() {
            const items = this.dateProduct.filter(item => {
                if (item.id === this.dateProduct.id) {
                    return true
                }
            })
            this.dateProduct.estoque = this.dateProduct.estoque - items.length
        },
        alert(message) {
            this.alertMessage = message
            this.alertActive = true
            setTimeout(() => {
                this.alertActive = false
            }, 1500)
        },
        router() {
            const hash = document.location.hash
            if (hash) {
                this.fetProduct(hash.replace("#", ""))
            }
        }
    },
    watch: {
        dateProduct() {
            document.title = this.dateProduct.nome || "Techno"
            const hash = this.dateProduct.nome || ""
            history.pushState(null, null, `#${hash}`)
            if (this.dateProduct) {
                this.compararEstoque()
            }
        }
        ,
        carrinho() {
            window.localStorage.carrinho = JSON.stringify(this.carrinho)
        }
    },
    created() {
        this.router()
        this.fetProducts()
        this.checkLocalStorage()
    }
})