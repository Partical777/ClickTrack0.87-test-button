/*GLOBAL*/
var userID = "1234567";
var recordUserID = "Example"; //"Ihateuser";

/*+++++++++++++++++++++++++++++++++++++++++++++++++++ */
/*+++++++++++++++++++++++++++++++++++++++++++++++++++ */
/*+++++++++++++++++++++Firebase++++++++++++++++++++++ */
// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyAoM3RHcSvJngXXDB2Zgq61QJa87KKybtI",
    authDomain: "clicktracker-3d306.firebaseapp.com",
    databaseURL: "https://clicktracker-3d306.firebaseio.com",
    projectId: "clicktracker-3d306",
    storageBucket: "clicktracker-3d306.appspot.com",
    messagingSenderId: "602278567313",
    appId: "1:602278567313:web:a429545f99173204"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
let db = firebase.firestore();

//Get Firebase Datos
let user1 = db.collection(userID).doc(recordUserID);
user1.get().then(doc => {
    console.log(doc.data());
    loadData(doc.data());
});
/*+++++++++++++++++++++Firebase++++++++++++++++++++++ */
/*+++++++++++++++++++++++++++++++++++++++++++++++++++ */
/*+++++++++++++++++++++++++++++++++++++++++++++++++++ */

// Set the dimensions and margins of the diagram
var margin = { top: 20, right: 90, bottom: 30, left: 90 },
    width = 1920 - margin.left - margin.right,
    height = 720 - margin.top - margin.bottom;

// append the svg object to the body of the page
// appends a 'group' element to 'svg'
// moves the 'group' element to the top left margin
var svg = d3
    .select("body")
    .append("svg")
    .attr("width", width + margin.right + margin.left)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var i = 0,
    duration = 750,
    root;

// declares a tree layout and assigns the size
var treemap = d3.tree().size([height, width]);

function loadData(treeData) {
    // Assigns parent, children, height, depth
    console.log(treeData);

    // let bla = findthesamechildren(treeData, item);

    // //if thisobj has children
    // if (bla["item"]["children"][0]) {
    //     //push the new object inside the pointer object
    //     bla["treeData"]["children"].push(bla["item"]["children"][0]);
    // }

    // function findthesamechildren(subobj, thisobj) {
    //     if (subobj.name === thisobj.name) {
    //         //make clicked-time plus 1
    //         subobj["clicked-time"]++;
    //         //check name
    //         if (subobj.children) {
    //             //check if have children
    //             for (var k in subobj.children) {
    //                 //check each children if same
    //                 if (subobj.children[k].name === thisobj.children[0].name) {
    //                     //if subobj has children && children is same, then recursion.
    //                     return findthesamechildren(
    //                         subobj.children[k],
    //                         thisobj.children[0]
    //                     );
    //                 }
    //             }
    //             //if every children is different, return the object.
    //             return { treeData: subobj, item: thisobj };
    //         } else {
    //             //if doesn't have children, return the object.
    //             return { treeData: subobj, item: thisobj };
    //         }
    //     } else {
    //         //if name is different, return the object.
    //         return { treeData: subobj, item: thisobj };
    //     }
    // }

    //===========================================================
    //add data to root with hierachy function
    root = d3.hierarchy(treeData, function(d) {
        console.log(treeData);
        return d.children;
    });
    root.x0 = height / 2;
    root.y0 = 0;

    // !!==Collapse after the second level==!!
    // root.children.forEach(collapse);

    update(root);
}
// Collapse the node and all it's children
function collapse(d) {
    if (d.children) {
        d._children = d.children;
        d._children.forEach(collapse);
        d.children = null;
    }
}

function update(source) {
    // Assigns the x and y position for the nodes
    var treeData = treemap(root);

    // Compute the new tree layout.
    var nodes = treeData.descendants(),
        links = treeData.descendants().slice(1);

    // Normalize for fixed-depth.
    nodes.forEach(function(d) {
        d.y = d.depth * 180;
    });

    // ****************** Nodes section ***************************

    // Update the nodes...
    var node = svg.selectAll("g.node").data(nodes, function(d) {
        return d.id || (d.id = ++i);
    });

    // Enter any new modes at the parent's previous position.
    var nodeEnter = node
        .enter()
        .append("g")
        .attr("class", "node")
        .attr("transform", function(d) {
            return "translate(" + source.y0 + "," + source.x0 + ")";
        })
        .on("click", click);

    // Add Circle for the nodes
    nodeEnter
        .append("circle")
        .attr("class", "node")
        .attr("r", 1e-6)
        .style("fill", function(d) {
            return d._children ? "lightsteelblue" : "#fff";
        });

    // Add Name for the nodes
    nodeEnter
        .append("text")
        .attr("dy", ".35em")
        .attr("x", function(d) {
            return d.children || d._children ? -13 : 13;
        })
        .attr("text-anchor", function(d) {
            return d.children || d._children ? "end" : "start";
        })
        .text(function(d) {
            return d.data.name;
        })
        .on("click", function() {
            window.location.href = "/finishButton.html";
        });

    // Add Clicked-Time for the nodes
    nodeEnter
        .append("text")
        .attr("dy", "1.5em")
        .attr("x", 0)
        .style("fill", "red")
        .text(function(d) {
            return d.data["clicked-time"];
        });

    // UPDATE
    var nodeUpdate = nodeEnter.merge(node);

    // Transition to the proper position for the node
    nodeUpdate
        .transition()
        .duration(duration)
        .attr("transform", function(d) {
            return "translate(" + d.y + "," + d.x + ")";
        });

    // Update the node attributes and style
    nodeUpdate
        .select("circle.node")
        .attr("r", 10)
        .style("fill", function(d) {
            return d._children ? "lightsteelblue" : "#fff";
        })
        .attr("cursor", "pointer");

    // Remove any exiting nodes
    var nodeExit = node
        .exit()
        .transition()
        .duration(duration)
        .attr("transform", function(d) {
            return "translate(" + source.y + "," + source.x + ")";
        })
        .remove();

    // On exit reduce the node circles size to 0
    nodeExit.select("circle").attr("r", 1e-6);

    // On exit reduce the opacity of text labels
    nodeExit.select("text").style("fill-opacity", 1e-6);

    // ****************** links section ***************************

    // Update the links...
    var link = svg.selectAll("path.link").data(links, function(d) {
        return d.id;
    });

    // Enter any new links at the parent's previous position.
    var linkEnter = link
        .enter()
        .insert("path", "g")
        .attr("class", "link")
        .attr("d", function(d) {
            var o = { x: source.x0, y: source.y0 };
            return diagonal(o, o);
        });

    // UPDATE
    var linkUpdate = linkEnter.merge(link);

    // Transition back to the parent element position
    linkUpdate
        .transition()
        .duration(duration)
        .attr("d", function(d) {
            return diagonal(d, d.parent);
        });

    // Remove any exiting links
    var linkExit = link
        .exit()
        .transition()
        .duration(duration)
        .attr("d", function(d) {
            var o = { x: source.x, y: source.y };
            return diagonal(o, o);
        })
        .remove();

    // Store the old positions for transition.
    nodes.forEach(function(d) {
        d.x0 = d.x;
        d.y0 = d.y;
    });

    // Creates a curved (diagonal) path from parent to the child nodes
    function diagonal(s, d) {
        let path = `M ${s.y} ${s.x}
            C ${(s.y + d.y) / 2} ${s.x},
              ${(s.y + d.y) / 2} ${d.x},
              ${d.y} ${d.x}`;

        return path;
    }

    // Toggle children on click.
    function click(d) {
        if (d.children) {
            d._children = d.children;
            d.children = null;
        } else {
            d.children = d._children;
            d._children = null;
        }
        update(d);
    }
}
