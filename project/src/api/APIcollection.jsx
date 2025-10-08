import React, { Component } from 'react';
import { apiPost } from './ServiceManager'
import {GET_CATEGORY_URL,GET_STOREITEMS_URL } from '../utils/constant'



export default class StoreItemsData extends Component {

    handleClick = (id) => {
        this.props.addToCart(id);
    }
    constructor() {
        super();
        
        this.state = {
            isDialogOpen: false,
            ItemList: [],
            isLoading: true,
            quantity: 1,
            show: true,
            max: 5,
            min: 0,

        }

        // Switch
        this.state = { checked: false };
        this.handleChange = this.handleChange.bind(this);
    }

   
    async componentDidMount() {
        console.log("componentDidMount  :::::::::::: ")
        this.getItem();
    }
   
    // getcategory API calling.
    getItem() {

        let param = {
            //this is for only static perpose, you must be replace dyamic.
            StoreCode: 141
        }
        console.log("Get Item API  :::::::::::: ", param)
        this.setState({ isLoading: true });
        apiPost(
            GET_CATEGORY_URL,
            param,
            resp => {
                if (resp != undefined) {
                    if (resp.status == true ) {
                        console.log("Get Item API  :::::::::::: ", JSON.stringify(resp))
                        this.setState({
                            ItemList: resp.data
                        })
                        console.log("Get Category API ItemList :::::::::::: ", JSON.stringify(this.state.ItemList))

                        // resp.data.map((data) => {
                        //     this.setState({
                        //         list: resp.data
                        //     })

                        // })
                        this.setState({ isLoading: false });

                    } else {
                        console.log("Get Item response error  :::::::::::: ", resp.message)
                        this.setState({ isLoading: false });
                    }
                } else {
                    this.setState({ isLoading: false });
                    console.log("Get Item API response  :::::::::::: ", undefined)


                }
            },
            err => {
                console.log("Get Item API error  :::::::::::: ", err.message)
                this.setState({ isLoading: false });
            }
        );
    }

    render() {
        return (
            <div>
                {this.state.isLoading === false && this.state.ItemList.map((list, index) => {
                    return (
                        <li key={index}>
                            <a>{list.FoodCategory}</a>
                        </li>
                    )
                })}
            </div>
        );
    }
}
    

    