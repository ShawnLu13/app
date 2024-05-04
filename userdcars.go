// Chaincode is based on TA Ray's usedcars project as a template. 
// Because there are many path dependencies using the name userdcars, for the sake of simplicity we did not change the name of this go file. 
// Hope it will not cause any misunderstanding.

package main

import (
	"fmt"
	"strings"

	"github.com/hyperledger/fabric/core/chaincode/shim"
	"github.com/hyperledger/fabric/protos/peer"
)

// ProductTraceChaincode implements a chaincode for tracking the production and distribution of products
type ProductTraceChaincode struct {
}

func (t *ProductTraceChaincode) Init(stub shim.ChaincodeStubInterface) peer.Response {
	// Initialization logic if needed
		//Get args from the instantiation proposal
	args := stub.GetStringArgs()
	if len(args) != 1{
		return shim.Error("Incorrect arguments. Expecting a key.")
	}

	value := args[0] + "&" + strings.Repeat("&", 14)
	err := stub.PutState(args[0], []byte(value))
	if err != nil {
		return shim.Error(fmt.Sprintf("Failed to register product with ID ", args[0]))
	}
	return shim.Success(nil)
}

func (t *ProductTraceChaincode) Invoke(stub shim.ChaincodeStubInterface) peer.Response {
	fn, args := stub.GetFunctionAndParameters()

	var result string
	var err error

	switch fn {
	case "manufacturer":
		result, err = t.manufacturer(stub, args)
	case "logistian1":
		result, err = t.logistian(stub, args, 7)
	case "logistian2":
		result, err = t.logistian(stub, args, 9)
	case "logistian3":
		result, err = t.logistian(stub, args, 11)
	case "sales":
		result, err = t.sales(stub, args)
	case "query":
		result, err = t.query(stub, args)
	default:
		return shim.Error("Unsupported function call: " + fn)
	}

	if err != nil {
		return shim.Error(err.Error())
	}
	return shim.Success([]byte(result))
}


// Register a new product by the manufacturer
func (t *ProductTraceChaincode) manufacturer(stub shim.ChaincodeStubInterface, args []string) (string, error) {
	if len(args) != 7 {
		return "", fmt.Errorf("incorrect number of arguments. Expecting 7")
	}
	value := strings.Join(args, "&") + "&" + strings.Repeat("&", 9) // Append empty placeholders for logistics and sales
	err := stub.PutState(args[0], []byte(value))
	if err != nil {
		return "", fmt.Errorf("failed to register product with ID %s", args[0])
	}
	return value, nil
}

// Logistics phases
func (t *ProductTraceChaincode) logistian(stub shim.ChaincodeStubInterface, args []string, startPos int) (string, error) {
	if len(args) < 3 {
		return "", fmt.Errorf("incorrect number of arguments. Expecting at least 3")
	}
	productID := args[0]
	value, err := stub.GetState(productID)
	if err != nil || value == nil {
		return "", fmt.Errorf("product not found")
	}
	values := strings.Split(string(value), "&")
	for i, arg := range args[1:] {
		if startPos+i < len(values) {
			values[startPos+i] = arg
		}
	}
	newValue := strings.Join(values, "&")
	err = stub.PutState(productID, []byte(newValue))
	if err != nil {
		return "", fmt.Errorf("failed to update product logistics information")
	}
	return newValue, nil
}

// Sales phase
func (t *ProductTraceChaincode) sales(stub shim.ChaincodeStubInterface, args []string) (string, error) {
	if len(args) != 4 {
		return "", fmt.Errorf("incorrect number of arguments. Expecting 4 for sales")
	}
	productID := args[0]
	value, err := stub.GetState(productID)
	if err != nil || value == nil {
		return "", fmt.Errorf("product not found")
	}
	values := strings.Split(string(value), "&")
	for i, arg := range args[1:] {
		values[13+i] = arg
	}
	newValue := strings.Join(values, "&")
	err = stub.PutState(productID, []byte(newValue))
	if err != nil {
		return "", fmt.Errorf("failed to update product sales information")
	}
	return newValue, nil
}

// Query product information
func (t *ProductTraceChaincode) query(stub shim.ChaincodeStubInterface, args []string) (string, error) {
	if len(args) != 1 {
		return "", fmt.Errorf("incorrect number of arguments. Expecting 1 for query")
	}
	value, err := stub.GetState(args[0])
	if err != nil {
		return "", fmt.Errorf("failed to get product state")
	}
	if value == nil {
		return "", fmt.Errorf("product not found")
	}
	return string(value), nil
}

func main() {
	err := shim.Start(new(ProductTraceChaincode))
	if err != nil {
		fmt.Printf("Error starting ProductTraceChaincode: %s", err)
	}
}
