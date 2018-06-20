package hashmapDesign;

public  class HashMap  <K, V> {
	
	
	private int bucketSize = 0;
	private float loadfactor = 0.0F;
	private int count = 0;
	
	public class Entry<K,V>{
		
		K key;
		V value;
		Entry<K,V> next;
		
		public Entry(K key, V value)
		{
			this.key = key;
			this.value = value;
			this.next = null;
		}
	}
	
	private Entry[] bucket;
	
	/*  Initializes the Hash Map with bucket size and load factor */
	public HashMap(int bucketSize, float loadfactor)
	{
		this.bucketSize =  bucketSize; 
		this.loadfactor = loadfactor;
		bucket = new Entry[bucketSize];
	}
	
	/*  resizes the entire array and the entries are rehashed and distributed in the buckets */
	public Entry[] resizeArray(Entry[] bucket,int count)
	{
		int val = (int)(Math.log(bucket.length)/Math.log(2));
		val++;
		int newBucketLength = (int)Math.pow(2, val);
		Entry[] newBucket = new Entry[newBucketLength];
        for(Entry<K, V> ent : bucket)
        {
        	if(ent != null)
        	{
        		Entry<K,V> head = ent;
        		while(head != null)
        		{
        			int code = Math.abs(head.key.hashCode()% newBucketLength);        	
        			if(newBucket[code] != null)
        			{
        				Entry<K,V> e = newBucket[code];
        				ent.next = e;
        				e = ent;        				
        			}
        			newBucket[code] = head;
        			head =  head.next;
        			
        		}
        	}
        }     
		return newBucket;

	}
	
	/*  inserts the key-value pair */
	public <K, V> V put(K key, V value)
	{			
		bucketSize = bucket.length;
		float loadFactor = loadfactor * (float) bucketSize;
		int code = Math.abs(key.hashCode())%bucketSize;
		Entry<K,V> entry = bucket[code];
		if(entry != null)
		{		
			if(entry.key.equals(value))
			{
				entry.value = value;
			}	
			else
			{
				count++;
				while(entry.next != null)
				{
					entry = entry.next;
				}
				
				Entry<K,V> node = new Entry<K, V>(key, value);
				entry.next = node;
			}
		}
		else
		{
			count++;
			Entry<K,V> node = new Entry<K,V>(key, value);
			bucket[code] = node;
		}
	    if(count > loadFactor)
	    {
	    	bucket = resizeArray(bucket, count);
     		bucketSize = bucket.length;
	   	}
		return value;
	}


	/*  Gets the key-value pair */
	public <K> V get  (K key)
	{
		int code = Math.abs(key.hashCode())%bucketSize;
		Entry<K, V> head = bucket[code];
		while(head != null)
		{
			if(head.key.equals(key))
			{
				return (V) head.value;
			}
			head = head.next;
		}
		return null;
		
	}
	
	/* removes the key from the HashMap */
	public void remove(K key)
	{
		
		V value = null;
		int code = Math.abs(key.hashCode())%bucketSize;
		Entry<K, V> head = bucket[code];
		Entry<K, V> dummy = new Entry(key, value);
		dummy.next = head;
		Entry<K, V> prev = dummy;
		while(head != null)
		{
			
			if(head.key.equals(key))
			{
				prev.next = head.next;
			}
			prev = head;
			head = head.next;
		}
		bucket[code] = dummy.next;
	}
	
	/*  checks if the key is preesent in the Hash Map*/
	public <K> boolean containsKey(K key)
	{
		int code = Math.abs(key.hashCode())%bucketSize;
		Entry head = bucket[code];
		while(head != null)
		{
			if(head.key.equals(key))
			{
				return true;
			}
			head = head.next;
		}
		return false;
		
	}
}
