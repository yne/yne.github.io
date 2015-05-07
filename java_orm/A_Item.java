package lpql.agilespider.bdd;

import java.sql.Statement;
import java.util.HashMap;

public class A_Item {
	private HashMap<String, String> attr = new HashMap<String, String>();
	private Statement orm;
	
	public void set(String key, String value) {
		attr.put(key, value);
	}
	public String get(String key) {
		return attr.get(key);
	}
	public void delete() {
		System.out.println(orm);
	}
	public void setDb(Statement db) {
//		this.orm=db;
	}
	
}
