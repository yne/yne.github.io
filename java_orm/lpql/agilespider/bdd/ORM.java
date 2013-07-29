package lpql.agilespider.bdd;

import java.sql.*;
import java.util.ArrayList;


public class ORM {
	Statement db;
	public ORM(){
//		Class.forName("com.mysql.jdbc.Driver").newInstance();
	}
//Driver
	public void connect(String server,String user,String password) throws SQLException{
		this.db = DriverManager.getConnection("jdbc:mysql://"+server, user,password).createStatement();
	}
	public void disconnect(){
		try {
			this.db.getConnection().close();
			this.db.close();
		} catch (SQLException e) {
			System.out.println("SQL close error (but who care eh?)");
		}
	}
//Utility	
	private A_Item resultsetToItem(ResultSet rs,String classe){
		A_Item obj = null;
		try {
			String packageName = this.getClass().getPackage().getName();
			java.sql.ResultSetMetaData rsmd = rs.getMetaData();
			obj = (A_Item) Class.forName(packageName+"."+classe).newInstance();
			obj.setDb(this.db);
			for(int col=1;col<=rsmd.getColumnCount();col++){
				obj.set(rsmd.getColumnLabel(col),rs.getString(col));
			}
		} catch (SQLException | InstantiationException | IllegalAccessException | ClassNotFoundException e) {
			System.err.println("Error during instantiation");
		}
		return obj;
	}
//DataBase
	public ArrayList<A_Item> getItemsByAttribute(String classe,String attributName,String value) {
		ArrayList<A_Item> tab = new ArrayList<A_Item>();
		try {
			ResultSet rs = db.executeQuery("SELECT * FROM "+classe+" WHERE "+classe+"_"+attributName+"="+value);
			while (rs.next())
				tab.add(resultsetToItem(rs,classe));
		} catch (SQLException e) {
			System.err.println("Can't get from "+classe);
		}
		return tab;
	}
	public A_Item getItemByAttribute(String classe,String attributName,String value) {
		ArrayList<A_Item> items = getItemsByAttribute(classe,attributName,value);
		if(items==null || items.size()==0)return null;
		return items.get(0); 
	}
	public ArrayList<A_Item> getAll(String classe) {
		ArrayList<A_Item> tab = new ArrayList<A_Item>();
		try {
			ResultSet rs = db.executeQuery("SELECT * FROM "+classe);
			while (rs.next())
				tab.add(resultsetToItem(rs,classe));
		} catch (SQLException e) {
			System.err.println("Can't select from "+classe);
		}
		return tab;
	}
	public A_Item getItemById(String classe,int id) {
		return getItemByAttribute(classe,"id",""+id);
	}
	public ArrayList<A_Item> getItemByParentId(String classe,int id) {
		return getItemsByAttribute(classe,"parent",""+id);
	}
}
